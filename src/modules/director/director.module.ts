import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDirectorUseCase } from './create-director/create-director-use-case';
import { CreateDirectorController } from './create-director/create-director.controller';
import { ListDirectorsUseCase } from './list-directors/list-directors-use-case';
import { ListDirectorsController } from './list-directors/list-directors.controller';

@Module({
  imports: [],
  controllers: [
    CreateDirectorController,
    ListDirectorsController
  ],
  providers: [
    PrismaService,
    CreateDirectorUseCase,
    ListDirectorsUseCase
  ],
})
export class DirectorModule { }