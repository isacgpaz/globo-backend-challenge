import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AccessLevel } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { CreateCategoryUseCase } from "./create-category-use-case";

const createCategory = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório.',
    invalid_type_error: 'Nome é obrigatório.',
  })
    .min(1, 'Nome é obrigatório.'),
});

type CreateCategory = z.infer<typeof createCategory>;

@Controller('/category')
export class CreateCategoryController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCategory))
  async handle(@Body() createCategory: CreateCategory) {
    const result = await this.createCategoryUseCase.execute(createCategory);
    return result;
  }
}