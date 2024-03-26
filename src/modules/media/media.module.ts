import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaUseCase } from './create-media/create-media-use-case';
import { CreateMediaController } from './create-media/create-media.controller';

@Module({
  imports: [],
  controllers: [
    CreateMediaController
  ],
  providers: [
    PrismaService,
    CreateMediaUseCase
  ],
})
export class MediaModule { }