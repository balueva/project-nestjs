import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(NewsEntity)
        private readonly newsRepository: Repository<NewsEntity>,
    ) { }

    async create(news: NewsEntity) {
        return await this.newsRepository.save(news);
    }

    async findAll(): Promise<NewsEntity[]> {
        return await this.newsRepository.find({});
    }

    async findById(id: number): Promise<NewsEntity | null> {
        return await this.newsRepository.findOneBy({ id });
    }

    async update(news: NewsEntity) {
        return await this.newsRepository.save(news);
    }

    async delete(id: number): Promise<NewsEntity | null> {
        const news: NewsEntity | null = await this.findById(id);

        return news ? await this.newsRepository.remove(news) : null;
    }

    async findByUser(userId: number): Promise<NewsEntity[] | null> {
        return await this.newsRepository.find({ where: { user: { id: userId } } });
    }
}
