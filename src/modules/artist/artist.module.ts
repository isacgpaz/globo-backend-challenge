import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtistUseCase } from './create-artist/create-artist-use-case';
import { CreateArtistController } from './create-artist/create-artist.controller';
import { ListArtistsUseCase } from './list-artists/list-artists-use-case';
import { ListArtistsController } from './list-artists/list-artists.controller';


@Module({
  imports: [],
  controllers: [
    CreateArtistController,
    ListArtistsController
  ],
  providers: [
    PrismaService,
    CreateArtistUseCase,
    ListArtistsUseCase
  ],
})
export class ArtistModule { }