import { Controller, Get, HttpCode, Query, UseGuards, UsePipes } from "@nestjs/common";
import { AccessLevel } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { ListArtistsUseCase } from "./list-artists-use-case";

const listArtists = z.object({
  name: z.string().optional().default(''),
  page: z
    .string({
      required_error: 'Número da página é obrigatório',
      invalid_type_error: 'Número da página é obrigatório',
    })
    .refine(
      (data) => typeof Number(data) === 'number',
      'Número da página é obrigatório',
    )
    .transform((data) => Number(data) - 1)
    .refine((data) => data >= 0, 'A página não pode ser menor que 1'),
  rowsPerPage: z
    .string({
      required_error: 'Quantidade por página é obrigatória',
      invalid_type_error: 'Quantidade por página é obrigatória',
    })
    .refine(
      (data) => typeof Number(data) === 'number',
      'Quantidade por página é obrigatória',
    )
    .transform((data) => Number(data)),
});

type ListArtists = z.infer<typeof listArtists>;

@Controller('/artist')
export class ListArtistsController {
  constructor(private readonly listArtistsUseCase: ListArtistsUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(listArtists))
  async handle(@Query() listArtists: ListArtists) {
    const result = await this.listArtistsUseCase.execute(listArtists);
    return result;
  }
}