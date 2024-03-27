import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { BlockUserUseCase } from './block-user/block-user-use-case';
import { BlockUserController } from './block-user/block-user.controller';
import { EnableUserUseCase } from './enable-user/enable-user-use-case';
import { EnableUserController } from './enable-user/enable-user.controller';
import { ListUsersUseCase } from './list-users/list-users-use-case';
import { ListUsersController } from './list-users/list-users.controller';

@Module({
  imports: [],
  controllers: [
    ListUsersController,
    EnableUserController,
    BlockUserController
  ],
  providers: [
    PrismaService,
    ListUsersUseCase,
    EnableUserUseCase,
    BlockUserUseCase
  ],
})

export class UsersModule { }