import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

interface SignIn {
  email: string;
  password: string;
}

@Injectable()
export class SignInUseCase {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async execute({ email, password }: SignIn) {
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

      if (!user) {
        throw new BadRequestException('Usuário e/ou senha inválidos.');
      }

      // const isPasswordMatched = await bcrypt.compare(password, user.password)
      const isPasswordMatched = password === user.password

      if (isPasswordMatched) {
        const { password, ...userWithoutPassword } = user

        return {
          accessToken: this.jwtService.sign({
            identifier: email,
            sub: user.id,
            accessLevel: user.accessLevel,
          }),
          user: userWithoutPassword,
        };
      }

      throw new BadRequestException('Usuário e/ou senha inválidos.');
    } catch (error) {
      throw error;
    }
  }
}