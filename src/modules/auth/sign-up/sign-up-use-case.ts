import { BadRequestException, Injectable } from '@nestjs/common';
import { AccessLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

interface SignUp {
  name: string;
  email: string;
  password: string;
  accessLevel: AccessLevel;
}

@Injectable()
export class SignUpUseCase {
  constructor(
    private prisma: PrismaService
  ) { }

  async execute({
    email,
    password,
    accessLevel,
    name
  }: SignUp) {
    try {
      email.toLowerCase().trim;

      const user = await this.prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      });

      if (user) {
        throw new BadRequestException('Email indisponível.');
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const createdUser = await this.prisma.user.create({
        data: {
          name,
          email,
          accessLevel,
          password: hashedPassword
        },
        select: {
          id: true,
          accessLevel: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return {
        user: createdUser,
      };

    } catch (error) {
      throw error;
    }
  }
}