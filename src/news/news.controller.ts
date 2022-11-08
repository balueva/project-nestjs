import { Controller, Get, Post, Body, Query, Res, HttpStatus, Param, Render } from '@nestjs/common';
import { Response } from 'express';
import { News } from './news.types';
import { NewsCreateDto } from './dtos/news-create.dto';
import { NewsIdDto } from './dtos/news-id.dto';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { MailService } from '../mail/mail.service';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService, private commentService: CommentsService,
        private mailService: MailService) { }

    /*
    @Get('all')
    @Render('news-list')
    getNews() {
        const news = this.newsService.findAll();
        return { news, title: 'lesson 04' };
    }
    */


    @Get('all')
    async getNews(): Promise<News[]> {
        return this.newsService.findAll();
    }


    @Get(':id')
    async getNewsById(@Param() param: NewsIdDto): Promise<News | null> {
        return this.newsService.findById(param.id);
    }

    @Get(':id/detail')
    @Render('news')
    async getNewsView(@Param() param: NewsIdDto) {
        const news = this.newsService.findById(param.id);
        const comments = await this.commentService.findAll(param.id);
        //return htmlTemplate(newsTemplate(news, comments));
        return { news, comments, title: 'lesson 04' };
    }

    @Post('create')
    async create(@Body() news: NewsCreateDto): Promise<boolean> {
        return this.newsService.create(news)
    }

    @Post('update')
    async update(@Query() param: NewsIdDto, @Body() news: NewsCreateDto, @Res() response: Response) {
        const oldValue = this.newsService.findById(param.id);
        if (this.newsService.update(param.id, news)) {
            response.status(HttpStatus.OK).send('OK')
            // савниваем старые и новые значения, шлем письмо
            let editedNews = {};
            if (oldValue.title !== news.title)
                editedNews = { ...editedNews, newsTitle: { oldValue: oldValue.title, newValue: news.title } }
            if (oldValue.description !== news.description)
                editedNews = { ...editedNews, newsDescription: { oldValue: oldValue.description, newValue: news.description } }

            await this.mailService.sendUpdatedNewsForAdmins(['addr'], editedNews
            );
        }
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
