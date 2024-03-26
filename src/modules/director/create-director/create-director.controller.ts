import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AccessLevel } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { CreateDirectorUseCase } from "./create-director-use-case";

const createDirector = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório.',
    invalid_type_error: 'Nome é obrigatório.',
  })
    .min(1, 'Nome é obrigatório.'),
});

type CreateDirector = z.infer<typeof createDirector>;

@Controller('/director')
export class CreateDirectorController {
  constructor(private readonly createDirectorUseCase: CreateDirectorUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDirector))
  async handle(@Body() createDirector: CreateDirector) {
    const result = await this.createDirectorUseCase.execute(createDirector);
    return result;
  }
}