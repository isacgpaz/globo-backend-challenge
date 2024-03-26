
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './shared/jwt.strategy';
import { SignInUseCase } from './sign-in/sign-in-use-case';
import { SignInController } from './sign-in/sign-in.controller';
import { SignUpUseCase } from './sign-up/sign-up-use-case';
import { SignUpController } from './sign-up/sign-up.controller';

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
    SignInUseCase,
    SignUpUseCase,
  ],
  controllers: [
    SignInController,
    SignUpController
  ],
  exports: [],
})
export class AuthModule { }