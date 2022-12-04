import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';

@Module({
    providers: [CategoriesService],
    controllers: [CategoriesController],
    imports: [TypeOrmModule.forFeature([CategoriesEntity])],
    exports: [CategoriesService]
})

export class CategoriesModule { }