import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';
import { NewsService } from '../news.service';
import { UsersService } from 'src/users/users.service';

import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsEntity)
        private readonly commentsRepository: Repository<CommentsEntity>,
        private readonly newsService: NewsService,
        private readonly usersService: UsersService,
        private readonly eventEmitter: EventEmitter2
    ) { }


    async create(newsId: number, userId: number, message: string) {

        const usersEntity = await this.usersService.findById(userId);
        if (!usersEntity)
            throw new HttpException('Не существует такого автора', HttpStatus.BAD_REQUEST);


        const newsEntity = await this.newsService.findById(newsId);
        if (!newsEntity)
            throw new HttpException('Не существует такой новости', HttpStatus.BAD_REQUEST);


        const commentsEntity = new CommentsEntity();
        commentsEntity.message = message;
        commentsEntity.user = usersEntity;
        commentsEntity.news = newsEntity;

        return await this.commentsRepository.save(commentsEntity);

    }



    async findById(commentId: number): Promise<CommentsEntity | null> {
        return await this.commentsRepository.findOne({
            where: { id: commentId },
            relations: ['news', 'user']
        });
    }

    async findAll(newsId: number): Promise<CommentsEntity[]> {
        return await this.commentsRepository.find(
            {
                where: { news: { id: newsId } },
                relations: ['user']
            });
    }


    async update(commentId: number, message: string) {
        const commentsEntity = await this.findById(commentId);
        if (!commentsEntity)
            throw new HttpException('Не существует комментария', HttpStatus.BAD_REQUEST);

        commentsEntity.message = message;
        const updatedComment = await this.commentsRepository.save(commentsEntity);
        this.eventEmitter.emit('comment.update', {
            commentId: commentId,
            newsId: commentsEntity.news.id,
            comment: updatedComment
        });
        return updatedComment;
    }

    async delete(commentId: number): Promise<CommentsEntity | null> {
        const comment: CommentsEntity | null = await this.findById(commentId);

        if (comment) {
            this.eventEmitter.emit('comment.delete', {
                commentId: comment.id,
                newsId: comment.news.id,
            });
            return await this.commentsRepository.remove(comment)
        }
        else
            return null;
    }

    async deleteAll(newsId: number): Promise<CommentsEntity[] | null> {
        const comments = await this.findAll(newsId);
        return await this.commentsRepository.remove(comments);
    }
}
