import {
  Injectable
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface ListArtists {
  name?: string,
  page: number,
  rowsPerPage: number,
}

@Injectable()
export class ListArtistsUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({
    page = 1,
    rowsPerPage = 10,
    name,
  }: ListArtists) {
    try {
      const query: Prisma.ArtistWhereInput = {}

      if (name) {
        query.name = {
          contains: name,
          mode: 'insensitive'
        }
      }

      const [artists, artistsCount] = await this.prisma.$transaction([
        this.prisma.artist.findMany({
          where: query,
          skip: page * rowsPerPage,
          take: rowsPerPage,
          orderBy: {
            createdAt: 'asc'
          }
        }),
        this.prisma.artist.count({
          where: query
        }),
      ])

      const totalPages = Math.ceil(artistsCount / rowsPerPage)
      const hasNextPage = page !== totalPages && totalPages !== 0
      const hasPreviousPage = page !== 1

      return {
        result: artists,
        meta: {
          total: artistsCount,
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