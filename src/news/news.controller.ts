import { Controller, Get, Post, Body, Query, Res, HttpStatus, Param } from '@nestjs/common';
import { Response } from 'express';
import { News } from './news.types';
import { NewsCreateDto } from './dtos/news-create.dto';
import { NewsIdDto } from './dtos/news-id.dto';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { htmlTemplate } from 'src/views/template';
import { newsTemplate } from 'src/views/news';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService, private commentService: CommentsService) { }

    @Get('all')
    async getNews(): Promise<News[]> {
        return this.newsService.findAll();
    }

    @Get(':id')
    async getNewsById(@Param() param: NewsIdDto): Promise<News | null> {
        return this.newsService.findById(param.id);
    }

    @Get(':id/detail')
    async getNewsView(@Param() param: NewsIdDto): Promise<string> {
        const news = this.newsService.findById(param.id);
        const comments = await this.commentService.findAll(param.id);
        return htmlTemplate(newsTemplate(news, comments));
    }

    @Post('create')
    async create(@Body() news: NewsCreateDto): Promise<boolean> {
        return this.newsService.create(news)
    }

    @Post('update')
    async update(@Query() param: NewsIdDto, @Body() news: NewsCreateDto, @Res() response: Response) {
        if (this.newsService.update(param.id, news))
            response.status(HttpStatus.OK).send('OK')
        else
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Item not found');
    }

    @Post('delete')
    async delete(@Query() param: NewsIdDto, @Res() response: Response) {
        if (this.newsService.delete(param.id)) {
            this.commentService.deleteAll(param.id);
            response.status(HttpStatus.OK).send('OK')
        }
        else
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Item not found');
    }

}
