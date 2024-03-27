import { Controller, HttpCode, Param, Patch, UseGuards } from "@nestjs/common";
import { AccessLevel } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { BlockUserUseCase } from "./block-user-use-case";

const userId = z.string().min(1, {
  message: 'Id inválido',
});

type MediaId = z.infer<typeof userId>;

const blockUserQueryPipe = new ZodValidationPipe(userId);

@Controller('/user')
export class BlockUserController {
  constructor(private readonly blockUserUseCase: BlockUserUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Patch(':id/block')
  @HttpCode(200)
  async handle(
    @Param('id', blockUserQueryPipe) userId: MediaId,
  ) {
    const result = await this.blockUserUseCase.execute({
      userId,
    });

    return result;
  }
}