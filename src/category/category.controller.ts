import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create.dto';
import { EditCategoryDto } from './dto/edit.dto';
import { OwnershipGuard } from '../ownership/ownership.guard';
import { SetOwnershipModel } from '../ownership/ownership.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @Get()
  async getUserCategories() {
    return this.categoryService.getUserCategories();
  }

  @Post()
  async create(@Body() data: CreateCategoryDto) {
    return this.categoryService.create(data);
  }

  @UseGuards(OwnershipGuard)
  @SetOwnershipModel({ model: 'Category' })
  @Patch()
  async editCategory(@Body() data: EditCategoryDto) {
    return this.categoryService.editCategory(data);
  }


  @UseGuards(OwnershipGuard)
  @SetOwnershipModel({ model: 'Category' })
  @Delete()
  async delete(@Query() data: EditCategoryDto) {
    return this.categoryService.deleteCategory(data);
  }

}
