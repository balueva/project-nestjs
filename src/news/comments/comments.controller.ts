import { Controller, Get, Post, Query, Body, Delete, Param, Put, UseInterceptors, UploadedFiles, Render } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comments.types';
import { CommentsIdDto } from './dtos/comments-id.dto';
import { CommentsPropsDto } from './dtos/comments-props.dto';
import { CommentsNewsidDto } from './dtos/comments-newsid.dto';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { HelperFileLoader } from '../../utils/helperFileLoader';

const PATH_COMMENTS = '/comments-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_COMMENTS;

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { };

    @Get('all')
    getAll(@Query() query: CommentsNewsidDto): Promise<Comment[]> {
        return this.commentsService.findAll(query.newsId)
    }

    @Post()
    @UseInterceptors(
        FilesInterceptor('avatar', 1, {
            storage: diskStorage({
                destination: helperFileLoader.destinationPath,
                filename: helperFileLoader.customFileName,
            }),
        }),
    )
    create(@Query() query: CommentsNewsidDto, @Body() userComment: CommentsPropsDto,
        @UploadedFiles() avatar: Express.Multer.File): Promise<number> {
        let avatarPath;
        if (avatar && avatar[0]?.filename?.length > 0) {
            avatarPath = PATH_COMMENTS + avatar[0].filename;
        }

        return this.commentsService.create(query.newsId, { ...userComment, avatar: avatarPath });
    }

    @Put(':id')
    update(@Query() query: CommentsNewsidDto, @Param() param: CommentsIdDto,
        @Body() newComment: CommentsPropsDto): Promise<boolean> {
        return this.commentsService.update(query.newsId, param.id, newComment);
    }

    @Delete('all')
    deleteAll(@Query() query: CommentsNewsidDto): Promise<boolean> {
        return this.commentsService.deleteAll(query.newsId);
    }

    @Delete(':id')
    delete(@Query() query: CommentsNewsidDto, @Param() param: CommentsIdDto): Promise<boolean> {
        return this.commentsService.delete(query.newsId, param.id);
    }
}
