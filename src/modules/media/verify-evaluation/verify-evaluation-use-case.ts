import {
  Injectable, NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface VerifyEvaluation {
  mediaId: string,
  userId: string
}

@Injectable()
export class VerifyEvaluationUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({ mediaId, userId }: VerifyEvaluation) {
    try {
      const media = await this.prisma.media.findUnique({
        where: {
          id: mediaId
        }
      })

      if (media) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId
          }
        })

        if (user) {
          const evaluation = await this.prisma.evaluation.findUnique({
            where: {
              mediaId_userId: {
                mediaId,
                userId
              }
            }
          })

          return {
            evaluationAvalable: !evaluation
          }
        }

        throw new NotFoundException('Usuário não encontrado.')
      }

      throw new NotFoundException('Mídia não encontrada.')
    } catch (error) {
      throw error;
    }
  }
}