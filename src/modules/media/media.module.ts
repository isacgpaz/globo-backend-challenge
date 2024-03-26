import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaUseCase } from './create-media/create-media-use-case';
import { CreateMediaController } from './create-media/create-media.controller';
import { EvaluateMediaUseCase } from './evaluate-media/evaluate-media-use-case';
import { EvaluateMediaController } from './evaluate-media/evaluate-media.controller';
import { ListMediasUseCase } from './list-medias/list-medias-use-case';
import { ListMediasController } from './list-medias/list-medias.controller';

@Module({
  imports: [],
  controllers: [
    CreateMediaController,
    ListMediasController,
    EvaluateMediaController
  ],
  providers: [
    PrismaService,
    CreateMediaUseCase,
    ListMediasUseCase,
    EvaluateMediaUseCase
  ],
})

export class MediaModule { }