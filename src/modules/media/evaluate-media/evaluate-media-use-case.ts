import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface EvaluateMedia {
  mediaId: string,
  userId: string,
  rate: number,
  comment?: string,
}

@Injectable()
export class EvaluateMediaUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({
    mediaId,
    userId,
    rate,
    comment
  }: EvaluateMedia) {
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

          if (evaluation) {
            throw new BadRequestException('Mídia já foi avaliada.')
          }

          const createdEvaluation = await this.prisma.evaluation.create({
            data: {
              rate,
              userId,
              mediaId,
              comment
            }
          })

          return {
            evaluation: createdEvaluation
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
