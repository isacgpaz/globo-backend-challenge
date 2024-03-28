import { Controller, Get, HttpCode, Param, Req, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { VerifyEvaluationUseCase } from "./verify-evaluation-use-case";

const mediaId = z.string().min(1, {
  message: 'Id inválido',
});

type MediaId = z.infer<typeof mediaId>;

const VerifyEvaluationQueryPipe = new ZodValidationPipe(mediaId);

@Controller('/media')
export class VerifyEvaluationController {
  constructor(private readonly getMediaUseCase: VerifyEvaluationUseCase) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/verify-evaluation')
  @HttpCode(200)
  async handle(
    @Param('id', VerifyEvaluationQueryPipe,) mediaId: MediaId,
    @Req() req: RequestWithUser
  ) {
    const result = await this.getMediaUseCase.execute({
      mediaId,
      userId: req.user.id
    });

    return result;
  }
}