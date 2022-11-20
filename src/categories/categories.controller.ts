import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesEntity } from './categories.entity';
import { CategoryCreateDto } from './dtos/category-create.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    async create(@Body() category: CategoryCreateDto): Promise<CategoriesEntity> {
        return this.categoriesService.create(category);
    }

}
