import {
  Injectable
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface ListDirectors {
  name?: string,
  page: number,
  rowsPerPage: number,
}

@Injectable()
export class ListDirectorsUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({
    page = 1,
    rowsPerPage = 10,
    name,
  }: ListDirectors) {
    try {
      const query: Prisma.DirectorWhereInput = {}

      if (name) {
        query.name = {
          contains: name,
          mode: 'insensitive'
        }
      }

      const [directors, directorsCount] = await this.prisma.$transaction([
        this.prisma.director.findMany({
          where: query,
          skip: page * rowsPerPage,
          take: rowsPerPage,
          orderBy: {
            createdAt: 'asc'
          }
        }),
        this.prisma.director.count({
          where: query
        }),
      ])

      const totalPages = Math.ceil(directorsCount / rowsPerPage)
      const hasNextPage = page !== totalPages && totalPages !== 0
      const hasPreviousPage = page !== 1

      return {
        result: directors,
        meta: {
          total: directorsCount,
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