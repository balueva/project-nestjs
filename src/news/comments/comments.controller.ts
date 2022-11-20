import {
    Controller, Get, Post, Query, Body, Delete, Param, Put, UseInterceptors,
    UploadedFiles, Render, HttpException, HttpStatus
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsIdDto } from './dtos/comments-id.dto';
import { CommentsPropsDto } from './dtos/comments-props.dto';
import { CommentsNewsidDto } from './dtos/comments-newsid.dto';
import { HelperFileLoader } from '../../utils/helperFileLoader';
import { NewsService } from '../news.service';
import { CommentsEntity } from './comments.entity';
import { UsersService } from 'src/users/users.service';

const PATH_COMMENTS = '/comments-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_COMMENTS;

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService,
        private readonly newsService: NewsService,
        private readonly usersService: UsersService) { };

    @Get('all')
    async getAll(@Query() query: CommentsNewsidDto) {
        const newsEntity = await this.newsService.findById(+query.newsId);
        if (!newsEntity)
            throw new HttpException('Не существует такой новости', HttpStatus.BAD_REQUEST);

        return await this.commentsService.findAll(query.newsId);
    }


    @Post()
    async create(@Query() query: CommentsNewsidDto, @Body() userComment: CommentsPropsDto) {
        let userEntity = null;
        if (userComment.author) {
            userEntity = await this.usersService.findById(userComment.author);
            if (!userEntity)
                throw new HttpException('Не существует такого автора', HttpStatus.BAD_REQUEST);
        }

        const newsEntity = await this.newsService.findById(query.newsId);
        if (!newsEntity)
            throw new HttpException('Не существует такой новости', HttpStatus.BAD_REQUEST);


        const commentsEntity = new CommentsEntity();
        commentsEntity.message = userComment.message;
        commentsEntity.user = userEntity;
        commentsEntity.news = newsEntity;
        return await this.commentsService.create(commentsEntity);
    }


    @Put(':id')
    async update(@Query() query: CommentsNewsidDto, @Param() param: CommentsIdDto,
        @Body() newComment: CommentsPropsDto): Promise<CommentsEntity> {

        const commentsEntity = await this.commentsService.findById(param.id);
        if (!commentsEntity)
            throw new HttpException('Не существует комментария', HttpStatus.BAD_REQUEST);

        commentsEntity.message = newComment.message;
        return await this.commentsService.update(commentsEntity);
    }

    @Delete('all')
    async deleteAll(@Query() query: CommentsNewsidDto): Promise<CommentsEntity[] | null> {
        return await this.commentsService.deleteAll(query.newsId);
    }


    @Delete(':id')
    delete(@Query() query: CommentsNewsidDto, @Param() param: CommentsIdDto): Promise<CommentsEntity | null> {
        return this.commentsService.delete(param.id);
    }

}
