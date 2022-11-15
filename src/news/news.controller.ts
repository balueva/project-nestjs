import {
    Controller, Get, Post, Body, Query, Res, HttpStatus, Param,
    Render, HttpException, Req
} from '@nestjs/common';
import { Response, Request } from 'express';
import { NewsCreateDto } from './dtos/news-create.dto';
import { NewsIdDto } from './dtos/news-id.dto';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService,
        private commentService: CommentsService,
        private mailService: MailService,
        private usersService: UsersService,
        private categoriesService: CategoriesService) { }

    /*
    @Get('all')
    @Render('news-list')
    getNews() {
        const news = this.newsService.findAll();
        return { news, title: 'lesson 04' };
    }
    */


    @Get('all')
    async getFilterNews(@Req() req: Request): Promise<NewsEntity[] | null> {
        console.log(req.query);
        if (req.query['user']) {
            console.log('filter', req.query['user']);
            return await this.newsService.findByUser(+req.query['user']);
        }
        else {
            console.log('all');
            return await this.newsService.findAll();
        }

    }

    @Get(':id')
    async getNewsById(@Param() param: NewsIdDto): Promise<NewsEntity | null> {
        return await this.newsService.findById(+param.id);
    }

    /*
        @Get(':id/detail')
        @Render('news')
        async getNewsView(@Param() param: NewsIdDto) {
            const news = this.newsService.findById(+param.id);
            const comments = await this.commentService.findAll(param.id);
            //return htmlTemplate(newsTemplate(news, comments));
            return { news, comments, title: 'lesson 04' };
        }
    */

    @Post('create')
    async create(@Body() news: NewsCreateDto) {

        // проверка, что автор новости существует
        let userEntity = null;
        if (news.authorId) {
            userEntity = await this.usersService.findById(news.authorId);
            if (!userEntity)
                throw new HttpException('Не существует такого автора', HttpStatus.BAD_REQUEST);
        }
        // проверка, что категория существует
        const categoryEntity = await this.categoriesService.findById(news.categoryId);
        if (!categoryEntity)
            throw new HttpException('Не существует такой категории', HttpStatus.BAD_REQUEST);

        const newsEntity = new NewsEntity();
        newsEntity.title = news.title;
        newsEntity.description = news.description;
        newsEntity.user = userEntity;
        newsEntity.category = categoryEntity;
        return await this.newsService.create(newsEntity);
    }

    @Post('update')
    async update(@Query() param: NewsIdDto, @Body() news: NewsCreateDto, @Res() response: Response) {

        const newsEntity = await this.newsService.findById(+param.id);
        if (newsEntity) {
            let userEntity = null;
            if (news.authorId) {
                userEntity = await this.usersService.findById(news.authorId);
                if (!userEntity)
                    throw new HttpException('Не существует такого автора', HttpStatus.BAD_REQUEST);
            }
            // проверка, что категория существует
            const categoryEntity = await this.categoriesService.findById(news.categoryId);
            if (!categoryEntity)
                throw new HttpException('Не существует такой категории', HttpStatus.BAD_REQUEST);

            const oldTitle = newsEntity.title;
            const oldDescription = newsEntity.description;
            //const oldCategory = newsEntity.category.id;

            newsEntity.title = news.title;
            newsEntity.description = news.description;
            newsEntity.user = userEntity;
            newsEntity.category = categoryEntity;
            await this.newsService.update(newsEntity);

            response.status(HttpStatus.OK).send('OK')
            // сравниваем старые и новые значения, шлем письмо
            let editedNews = {};
            if (oldTitle !== news.title)
                editedNews = { ...editedNews, newsTitle: { oldValue: oldTitle, newValue: news.title } }
            if (oldDescription !== news.description)
                editedNews = { ...editedNews, newsDescription: { oldValue: oldDescription, newValue: news.description } }
            //if (oldCategory !== news.categoryId)
            //    editedNews = { ...editedNews, newsCategory: { oldValue: oldCategory, newValue: news.categoryId } }

            await this.mailService.sendUpdatedNewsForAdmins(['81beu@mail.ru'], editedNews
            );
        }
        else
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Item not found');
    }


    @Post('delete')
    async delete(@Query() param: NewsIdDto, @Res() response: Response) {
        const news = await this.newsService.delete(+param.id);
        if (news) {
            this.commentService.deleteAll(+param.id);
            response.status(HttpStatus.OK).send('OK')
        }
        else
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Item not found');
    }
}
