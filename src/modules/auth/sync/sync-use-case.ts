import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface Sync {
  id: string
}

@Injectable()
export class SyncUseCase {
  constructor(
    private prisma: PrismaService
  ) { }

  async execute({
    id
  }: Sync) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id
        },
        select: {
          accessLevel: true,
          email: true,
          id: true,
          name: true
        }
      });

      if (user) {
        return { user }
      }

      throw new NotFoundException('Usuário não encontrado.');
    } catch (error) {
      throw error;
    }
  }
}