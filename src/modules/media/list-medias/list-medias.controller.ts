import { Controller, Get, HttpCode, Query, UseGuards, UsePipes } from "@nestjs/common";
import { AccessLevel, MediaType } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { ListMediasUseCase } from "./list-medias-use-case";

const listMedias = z.object({
  title: z.string().optional().default(''),
  directorId: z.string().optional(),
  artistsIds: z.array(z.string()).optional(),
  categoriesIds: z.array(z.string()).optional(),
  type: z.nativeEnum(MediaType).optional(),
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

type ListMedias = z.infer<typeof listMedias>;

@Controller('/media')
export class ListMediasController {
  constructor(private readonly listMediasUseCase: ListMediasUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Get()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(listMedias))
  async handle(@Query() listMedias: ListMedias) {
    const result = await this.listMediasUseCase.execute(listMedias);
    return result;
  }
}