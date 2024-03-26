import {
  Injectable
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateArtist {
  name: string,
}

@Injectable()
export class CreateArtistUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({ name }: CreateArtist) {
    try {
      const artist = await this.prisma.artist.create({
        data: {
          name,
        }
      })

      return {
        artist
      }
    } catch (error) {
      throw error;
    }
  }
}
