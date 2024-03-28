import { Controller, Get, HttpCode, Query, UseGuards, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { ListDirectorsUseCase } from "./list-directors-use-case";

const listDirectors = z.object({
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

type ListDirectors = z.infer<typeof listDirectors>;

@Controller('/director')
export class ListDirectorsController {
  constructor(private readonly listDirectorsUseCase: ListDirectorsUseCase) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(listDirectors))
  async handle(@Query() listDirectors: ListDirectors) {
    const result = await this.listDirectorsUseCase.execute(listDirectors);
    return result;
  }
}