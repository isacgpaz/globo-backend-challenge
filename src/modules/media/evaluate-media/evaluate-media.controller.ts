import { Body, Controller, HttpCode, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { AccessLevel } from "@prisma/client";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HasRole } from "../../auth/shared/role.decorator";
import { EvaluateMediaUseCase } from "./evaluate-media-use-case";

const evaluateMedia = z.object({
  rate: z.number({
    invalid_type_error: 'Nota é obrigatória.',
    required_error: 'Nota é obrigatória.',
  })
    .int('A nota deve ser um número inteiro')
    .min(0, 'A nota mínima é 0.')
    .max(4, 'A nota máxima é 4.'),
  comment: z.string({
    invalid_type_error: 'Comentário inválido.',
  })
    .min(1, 'O comentário não pode ser vazio.')
    .optional(),
});

const mediaId = z.string().min(1, {
  message: 'Id inválido',
});

type EvaluateMedia = z.infer<typeof evaluateMedia>;
type MediaId = z.infer<typeof mediaId>;

const evaluateMediaQueryPipe = new ZodValidationPipe(mediaId);
const evaluateMediaBodyPipe = new ZodValidationPipe(evaluateMedia);

@Controller('/media')
export class EvaluateMediaController {
  constructor(private readonly evaluateMediaUseCase: EvaluateMediaUseCase) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(AccessLevel.USER)
  @Patch(':id/evaluate')
  @HttpCode(200)
  async handle(
    @Param('id', evaluateMediaQueryPipe) mediaId: MediaId,
    @Body(evaluateMediaBodyPipe) evaluateMedia: EvaluateMedia,
    @Req() req: RequestWithUser
  ) {
    const result = await this.evaluateMediaUseCase.execute({
      ...evaluateMedia,
      userId: req.user.id,
      mediaId,
    });

    return result;
  }
}