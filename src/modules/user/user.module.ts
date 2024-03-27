import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { ListUsersUseCase } from './list-users/list-users-use-case';
import { ListUsersController } from './list-users/list-users.controller';

@Module({
  imports: [],
  controllers: [
    ListUsersController,
  ],
  providers: [
    PrismaService,
    ListUsersUseCase,

  ],
})

export class UsersModule { }