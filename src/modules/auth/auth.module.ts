
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './shared/jwt.strategy';
import { SignInUseCase } from './sign-in/sign-in-use-case';
import { SignInController } from './sign-in/sign-in.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    PrismaService,
    JwtStrategy,
    SignInUseCase
  ],
  controllers: [
    SignInController
  ],
  exports: [],
})
export class AuthModule { }