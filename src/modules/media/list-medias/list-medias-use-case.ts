import {
  Injectable
} from '@nestjs/common';
import { MediaType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface ListMedias {
  title?: string,
  type?: MediaType,
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
    title,
    type
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
        query.categories = {
          some: {
            id: {
              in: categoriesIds
            }
          }
        }
      }

      if (artistsIds) {
        query.artists = {
          some: {
            id: {
              in: artistsIds
            }
          }
        }
      }

      if (directorId) {
        query.directorId = directorId
      }

      if (type) {
        query.type = type
      }

      const [medias, mediasCount] = await this.prisma.$transaction([
        this.prisma.media.findMany({
          where: query,
          skip: page * rowsPerPage,
          take: rowsPerPage,
          orderBy: {
            title: 'asc'
          }
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