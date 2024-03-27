import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryUseCase } from './create-category/create-category-use-case';
import { CreateCategoryController } from './create-category/create-category.controller';
import { ListCategoriesUseCase } from './list-categories/list-categories-use-case';
import { ListCategoriesController } from './list-categories/list-categories.controller';

@Module({
  imports: [],
  controllers: [
    CreateCategoryController,
    ListCategoriesController
  ],
  providers: [
    PrismaService,
    CreateCategoryUseCase,
    ListCategoriesUseCase
  ],
})
export class CategoryModule { }