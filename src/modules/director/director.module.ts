import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDirectorUseCase } from './create-director-use-case';
import { CreateDirectorController } from './create-director.controller';


@Module({
  imports: [],
  controllers: [
    CreateDirectorController
  ],
  providers: [
    PrismaService,
    CreateDirectorUseCase
  ],
})
export class DirectorModule { }