import {
  Injectable
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface ListMedias {
  title?: string,
  categoriesIds?: string[],
  directorId?: string,
  artistsIds?: string[],
  page: number,
  rowsPerPage: number,
}

@Injectable()
export class ListMediasUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({
    artistsIds,
    directorId,
    page = 1,
    rowsPerPage = 10,
    categoriesIds,
    title
  }: ListMedias) {
    try {
      const query: Prisma.MediaWhereInput = {}

      if (title) {
        query.title = {
          contains: title,
          mode: 'insensitive'
        }
      }

      if (categoriesIds) {
        query.categoriesIds = {
          hasSome: categoriesIds
        }
      }

      if (artistsIds) {
        query.artistsIds = {
          hasSome: artistsIds
        }
      }

      if (directorId) {
        query.directorId = directorId
      }

      const [medias, mediasCount] = await this.prisma.$transaction([
        this.prisma.media.findMany({
          where: query,
          skip: page * rowsPerPage,
          take: rowsPerPage,
        }),
        this.prisma.media.count({
          where: query
        }),
      ])

      const totalPages = Math.ceil(mediasCount / rowsPerPage)
      const hasNextPage = page !== totalPages && totalPages !== 0
      const hasPreviousPage = page !== 1

      return {
        result: medias,
        meta: {
          total: mediasCount,
          page: page + 1,
          rowsPerPage,
          hasNextPage,
          hasPreviousPage
        }
      }
    } catch (error) {
      throw error;
    }
  }
}