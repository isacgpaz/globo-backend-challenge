import {
  Injectable
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface ListCategories {
  name?: string,
  page: number,
  rowsPerPage: number,
}

@Injectable()
export class ListCategoriesUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({
    page = 1,
    rowsPerPage = 10,
    name,
  }: ListCategories) {
    try {
      const query: Prisma.CategoryWhereInput = {}

      if (name) {
        query.name = {
          contains: name,
          mode: 'insensitive'
        }
      }

      const [categories, categoriesCount] = await this.prisma.$transaction([
        this.prisma.category.findMany({
          where: query,
          skip: page * rowsPerPage,
          take: rowsPerPage,
          orderBy: {
            createdAt: 'asc'
          }
        }),
        this.prisma.category.count({
          where: query
        }),
      ])

      const totalPages = Math.ceil(categoriesCount / rowsPerPage)
      const hasNextPage = page !== totalPages && totalPages !== 0
      const hasPreviousPage = page !== 1

      return {
        result: categories,
        meta: {
          total: categoriesCount,
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