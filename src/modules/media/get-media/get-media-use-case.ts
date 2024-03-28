import {
  Injectable, NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface GetMedia {
  mediaId: string
}

@Injectable()
export class GetMediaUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({ mediaId }: GetMedia) {
    try {
      const
        media = await this.prisma.media.findUnique({
          where: {
            id: mediaId
          },
          include: {
            artists: {
              select: {
                name: true,
                id: true
              }
            },
            categories: {
              select: {
                name: true,
                id: true
              }
            },
            director: {
              select: {
                name: true,
                id: true
              }
            },
            serie: {
              select: {
                id: false,
                seasons: {
                  include: {
                    episodes: true
                  }
                }
              }
            },
            movie: {
              select: {
                id: false,
                duration: true,
              }
            },
          },
        })

      const [evaluations, evaluationsCount] = await this.prisma.$transaction([
        this.prisma.evaluation.findMany({
          where: {
            mediaId,
          },
        }),
        this.prisma.evaluation.count({
          where: {
            mediaId
          }
        })
      ])

      let evaluationRateTotal = 0

      evaluations.forEach(evaluate => {
        evaluationRateTotal += evaluate.rate
      });

      const averageRate = evaluationsCount
        ? (evaluationRateTotal / evaluationsCount)
        : null

      if (media) {
        return {
          media,
          averageRate
        }
      }

      throw new NotFoundException('Mídia não encontrada.')
    } catch (error) {
      throw error;
    }
  }
}