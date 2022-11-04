import { Injectable } from '@nestjs/common';
import { News } from './news.types';
import { NewsCreateDto } from './dtos/news-create.dto';

@Injectable()
export class NewsService {
    private readonly news: News[] = [];

    create(userDataNews: NewsCreateDto): boolean {
        const d = new Date();
        const news: News = { ...userDataNews, id: d.getTime().toString(), createdAt: d };

        this.news.push(news);
        return true;
    }

    findAll(): News[] {
        return this.news;
    }

    findById(id: string): News | null {
        const item = this.news.find(item => item.id === id);
        return item ? item : null;
    }

    update(id: string, userDataNews: NewsCreateDto): boolean {
        const idx: number = this.news.findIndex(item => item.id === id);

        if (idx >= 0)
            this.news[idx] = { ...this.news[idx], ...userDataNews };

        return idx >= 0;
    }

    delete(id: string): boolean {
        const idx: number = this.news.findIndex(item => item.id === id);

        if (idx >= 0)
            this.news.splice(idx, 1);

        return idx >= 0;
    }
}
