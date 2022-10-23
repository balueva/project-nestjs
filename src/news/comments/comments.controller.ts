import { Controller, Get, Post, Query, Body, Delete, Param, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment, UserComment } from './comments.types';

const QUERY_NEWS_ID = 'newsId';
const PARAM_COMMENT_ID = 'id';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { };

    @Get('all')
    getAll(@Query(QUERY_NEWS_ID) newsId: string): Promise<Comment[]> {
        return this.commentsService.findAll(newsId)
    }

    @Post()
    create(@Query(QUERY_NEWS_ID) newsId: string, @Body() userComment: UserComment): Promise<number> {
        return this.commentsService.create(newsId, userComment);
    }

    @Put(`:${PARAM_COMMENT_ID}`)
    update(@Query(QUERY_NEWS_ID) newsId: string, @Param(PARAM_COMMENT_ID) commentId: string,
        @Body() newComment: UserComment): Promise<boolean> {
        return this.commentsService.update(newsId, commentId, newComment);
    }

    @Delete('all')
    deleteAll(@Query(QUERY_NEWS_ID) newsId: string): Promise<boolean> {
        return this.commentsService.deleteAll(newsId);
    }

    @Delete(`:${PARAM_COMMENT_ID}`)
    delete(@Query(QUERY_NEWS_ID) newsId: string, @Param(PARAM_COMMENT_ID) commentId: string): Promise<boolean> {
        return this.commentsService.delete(newsId, commentId);
    }
}
