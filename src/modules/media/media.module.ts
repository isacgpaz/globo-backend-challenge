import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaUseCase } from './create-media/create-media-use-case';
import { CreateMediaController } from './create-media/create-media.controller';
import { EvaluateMediaUseCase } from './evaluate-media/evaluate-media-use-case';
import { EvaluateMediaController } from './evaluate-media/evaluate-media.controller';
import { GetMediaUseCase } from './get-media/get-media-use-case';
import { GetMediaController } from './get-media/get-media.controller';
import { ListMediasUseCase } from './list-medias/list-medias-use-case';
import { ListMediasController } from './list-medias/list-medias.controller';
import { UpdateMediaUseCase } from './update-media/update-media-use-case';
import { UpdateMediaController } from './update-media/update-media.controller';
import { VerifyEvaluationUseCase } from './verify-evaluation/verify-evaluation-use-case';
import { VerifyEvaluationController } from './verify-evaluation/verify-evaluation.controller';

@Module({
  imports: [],
  controllers: [
    CreateMediaController,
    ListMediasController,
    EvaluateMediaController,
    GetMediaController,
    UpdateMediaController,
    VerifyEvaluationController
  ],
  providers: [
    PrismaService,
    CreateMediaUseCase,
    ListMediasUseCase,
    EvaluateMediaUseCase,
    GetMediaUseCase,
    UpdateMediaUseCase,
    VerifyEvaluationUseCase
  ],
})

export class MediaModule { }