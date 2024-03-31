import { Controller, Get, HttpCode, Query, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { ListCategoriesUseCase } from "./list-categories-use-case";

const listCategories = z.object({
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

type ListCategories = z.infer<typeof listCategories>;

@Controller('/category')
export class ListCategoriesController {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) { }

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(listCategories))
  async handle(@Query() listCategories: ListCategories) {
    const result = await this.listCategoriesUseCase.execute(listCategories);
    return result;
  }
}