import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtistUseCase } from './create-artist/create-artist-use-case';
import { CreateArtistController } from './create-artist/create-artist.controller';


@Module({
  imports: [],
  controllers: [
    CreateArtistController
  ],
  providers: [
    PrismaService,
    CreateArtistUseCase
  ],
})
export class ArtistModule { }