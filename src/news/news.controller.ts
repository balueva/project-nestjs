import { Controller, Get, Post, Body, Query, Res, HttpStatus, Param } from '@nestjs/common';
import { Response } from 'express';
import { News, UserDataNews } from './news.types';
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
    async getNewsById(@Param('id') id: string): Promise<News | null> {
        return this.newsService.findById(id);
    }

    @Get(':id/detail')
    async getNewsView(@Param('id') id: string): Promise<string> {
        const news = this.newsService.findById(id);
        const comments = await this.commentService.findAll(id);
        return htmlTemplate(newsTemplate(news, comments));
    }

    @Post('create')
    async create(@Body() news: UserDataNews): Promise<boolean> {
        return this.newsService.create(news)
    }

    @Post('update')
    async update(@Query('id') id: string, @Body() news: UserDataNews, @Res() response: Response) {
        if (this.newsService.update(id, news))
            response.status(HttpStatus.OK).send('OK')
        else
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Item not found');
    }

    @Post('delete')
    async delete(@Query('id') id: string, @Res() response: Response) {
        if (this.newsService.delete(id)) {
            this.commentService.deleteAll(id);
            response.status(HttpStatus.OK).send('OK')
        }
        else
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Item not found');
    }

}
