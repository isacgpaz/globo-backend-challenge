import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './modules/artist/artist.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { DirectorModule } from './modules/director/director.module';
import { MediaModule } from './modules/media/media.module';
import { UsersModule } from './modules/user/user.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    DirectorModule,
    ArtistModule,
    CategoryModule,
    MediaModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
