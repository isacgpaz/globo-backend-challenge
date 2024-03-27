import {
  Injectable
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface ListUsers {
  name?: string,
  page: number,
  rowsPerPage: number,
}

@Injectable()
export class ListUsersUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({
    page = 1,
    rowsPerPage = 10,
    name
  }: ListUsers) {
    try {
      const query: Prisma.UserWhereInput = {}

      if (name) {
        query.name = {
          contains: name,
          mode: 'insensitive'
        }
      }

      const [users, usersCount] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where: query,
          skip: page * rowsPerPage,
          take: rowsPerPage,
        }),
        this.prisma.user.count({
          where: query
        }),
      ])

      const totalPages = Math.ceil(usersCount / rowsPerPage)
      const hasNextPage = page !== totalPages && totalPages !== 0
      const hasPreviousPage = page !== 1

      return {
        result: users,
        meta: {
          total: usersCount,
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