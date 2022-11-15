import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryCreateDto } from './dtos/category-create.dto';
import { CategoriesEntity } from './categories.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoriesEntity)
        private readonly categoriesRepository: Repository<CategoriesEntity>,
    ) { }

    async create(category: CategoryCreateDto) {
        const categoryEntity = new CategoriesEntity();
        categoryEntity.name = category.name;
        return await this.categoriesRepository.save(categoryEntity);
    }

    async findById(id: number): Promise<CategoriesEntity | null> {
        return await this.categoriesRepository.findOneBy({ id });
    }
}
