import {
  Injectable
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateDirector {
  name: string,
}

@Injectable()
export class CreateDirectorUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({ name }: CreateDirector) {
    try {
      const director = await this.prisma.director.create({
        data: {
          name,
        }
      })

      return {
        director
      }
    } catch (error) {
      throw error;
    }
  }
}
