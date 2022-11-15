import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesEntity } from './categories.entity';
import { CategoryCreateDto } from './dtos/category-create.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    async create(@Body() category: CategoryCreateDto): Promise<CategoriesEntity> {
        return this.categoriesService.create(category);
    }

}
