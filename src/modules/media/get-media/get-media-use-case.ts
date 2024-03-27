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
            artists: true,
            categories: true,
            director: true,
            serie: true,
            movie: true,
          }
        })

      if (media) {
        return {
          media: {
            id: media.id,
            title: media.title,
            description: media.description,
            releaseDate: media.releaseDate,
            artists: media.artists,
            director: media.director,
            categories: media.categories,
            parentalRating: media.parentalRating,
            serie: media.serie,
            movie: media.movie,
            type: media.type,
          }
        }
      }

      throw new NotFoundException('Mídia não encontrada.')
    } catch (error) {
      throw error;
    }
  }
}