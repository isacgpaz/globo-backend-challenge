import {
  Injectable
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateCategory {
  name: string,
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({ name }: CreateCategory) {
    try {
      const category = await this.prisma.category.create({
        data: {
          name,
        }
      })

      return {
        category
      }
    } catch (error) {
      throw error;
    }
  }
}
