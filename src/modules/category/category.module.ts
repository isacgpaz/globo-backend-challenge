import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryUseCase } from './create-category/create-category-use-case';
import { CreateCategoryController } from './create-category/create-category.controller';

@Module({
  imports: [],
  controllers: [
    CreateCategoryController
  ],
  providers: [
    PrismaService,
    CreateCategoryUseCase
  ],
})
export class CategoryModule { }