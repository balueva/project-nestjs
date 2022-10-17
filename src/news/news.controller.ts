import { Controller, Get, Post, Body, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { News, UserDataNews } from './news.interface';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @Get('all')
    async getNews(): Promise<News[]> {
        return this.newsService.findAll();
    }

    @Post('create')
    async create(@Body() news: UserDataNews): Promise<boolean> {
        return this.newsService.create(news)
    }

    @Post('update')
    async update(@Query('id') id: number, @Body() news: UserDataNews, @Res() response: Response) {
        if (this.newsService.update(id, news))
            response.status(HttpStatus.OK).send('OK')
        else
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Item not found');
    }

    @Post('delete')
    async delete(@Query('id') id: number, @Body() news: UserDataNews, @Res() response: Response) {
        if (this.newsService.delete(id, news))
            response.status(HttpStatus.OK).send('OK')
        else
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Item not found');
    }
}
