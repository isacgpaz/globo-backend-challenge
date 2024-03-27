import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface BlockUser {
  userId: string,
}

@Injectable()
export class BlockUserUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({
    userId,
  }: BlockUser) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        }
      })

      if (user) {
        const updatedUser = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            status: UserStatus.BLOCKED
          }
        })

        return {
          user: updatedUser
        }
      }

      throw new NotFoundException('Usuário não encontrado.')
    } catch (error) {
      throw error;
    }
  }
}
