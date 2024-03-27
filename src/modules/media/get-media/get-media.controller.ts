import { Controller, Get, HttpCode, Param, UseGuards } from "@nestjs/common";
import { AccessLevel } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { GetMediaUseCase } from "./get-media-use-case";

const mediaId = z.string().min(1, {
  message: 'Id inválido',
});

type MediaId = z.infer<typeof mediaId>;

const getMediaIdQueryPipe = new ZodValidationPipe(mediaId);

@Controller('/media')
export class GetMediaController {
  constructor(private readonly getMediaUseCase: GetMediaUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.ADMIN)
  @Get('/:id')
  @HttpCode(200)
  async handle(@Param('id', getMediaIdQueryPipe) mediaId: MediaId) {
    const result = await this.getMediaUseCase.execute({
      mediaId
    });

    return result;
  }
}