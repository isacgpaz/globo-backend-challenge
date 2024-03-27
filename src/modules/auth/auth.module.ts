
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './shared/jwt.strategy';
import { SignInUseCase } from './sign-in/sign-in-use-case';
import { SignInController } from './sign-in/sign-in.controller';
import { SignUpUseCase } from './sign-up/sign-up-use-case';
import { SignUpController } from './sign-up/sign-up.controller';
import { SyncUseCase } from './sync/sync-use-case';
import { SyncController } from './sync/sync.controller';

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
    SyncUseCase
  ],
  controllers: [
    SignInController,
    SignUpController,
    SyncController
  ],
  exports: [],
})
export class AuthModule { }