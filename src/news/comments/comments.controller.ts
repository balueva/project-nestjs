import {
    Controller, Get, Post, Query, Body, Delete, Param, Put, UseInterceptors,
    UploadedFiles, Render, HttpException, HttpStatus, UseGuards, ParseIntPipe, Req
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { CommentsIdDto } from './dtos/comments-id.dto';
import { CommentsPropsDto } from './dtos/comments-props.dto';
import { CommentsNewsidDto } from './dtos/comments-newsid.dto';
import { HelperFileLoader } from '../../utils/helperFileLoader';
import { NewsService } from '../news.service';
import { CommentsEntity } from './comments.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

        return await this.commentsService.findAll(+query.newsId);
    }


    @Post(':newsId')
    @UseGuards(JwtAuthGuard)
    async create(@Param('newsId', ParseIntPipe) newsId: number, @Body() userComment: CommentsPropsDto,
        @Req() req: Request) {
        console.log('aaa');
        const userId = req.user['id'];

        return await this.commentsService.create(newsId, userId, userComment.message);
    }

    /*
    
    @Post(':newsId')
    @UseGuards(JwtAuthGuard)
    async create(@Param('newsId', ParseIntPipe) newsId: number, @Body() userComment: CommentsPropsDto,
        @Req() req: Request) {
        const jwtUserId: number = req.user['userId'];
        console.log('CREATE COMMENT jwtUserId = ', jwtUserId);

        return await this.commentsService.create(newsId, jwtUserId, userComment.message);
    }
    */

    /*
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Query() query: CommentsNewsidDto, @Body() userComment: CommentsPropsDto) {
        return await this.commentsService.create(query.newsId, userComment.author, userComment.message);
    }
    */

    @Put(':id')
    async update(@Param() param: CommentsIdDto,
        @Body() newComment: CommentsPropsDto): Promise<CommentsEntity> {

        return await this.commentsService.update(+param.id, newComment.message);
    }
    /*
    @Put(':id')
    async update(@Query() query: CommentsNewsidDto, @Param() param: CommentsIdDto,
        @Body() newComment: CommentsPropsDto): Promise<CommentsEntity> {

        const commentsEntity = await this.commentsService.findById(+param.id);
        if (!commentsEntity)
            throw new HttpException('Не существует комментария', HttpStatus.BAD_REQUEST);

        commentsEntity.message = newComment.message;
        return await this.commentsService.update(commentsEntity);
    }
*/
    @Delete('all')
    async deleteAll(@Query() query: CommentsNewsidDto): Promise<CommentsEntity[] | null> {
        return await this.commentsService.deleteAll(+query.newsId);
    }


    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Query() query: CommentsNewsidDto, @Param() param: CommentsIdDto, @Req() req: Request): Promise<CommentsEntity | null> {
        const userId = req.user['id'];
        return this.commentsService.delete(+param.id);
    }

}
