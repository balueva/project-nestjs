import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsEntity)
        private readonly commentsRepository: Repository<CommentsEntity>,
    ) { }


    async create(comment: CommentsEntity) {
        return await this.commentsRepository.save(comment);
    }

    async findById(commentId: number): Promise<CommentsEntity | null> {
        return await this.commentsRepository.findOneBy({ id: commentId });
    }

    async findAll(newsId: number): Promise<CommentsEntity[]> {
        return await this.commentsRepository.find({ where: { news: { id: newsId } } });
    }

    async update(comment: CommentsEntity) {
        return await this.commentsRepository.save(comment);
    }

    async delete(commentId: number): Promise<CommentsEntity | null> {
        const comment: CommentsEntity | null = await this.findById(commentId);

        return comment ? await this.commentsRepository.remove(comment) : null;
    }

    async deleteAll(newsId: number): Promise<CommentsEntity[] | null> {
        const comments = await this.findAll(newsId);
        return await this.commentsRepository.remove(comments);
    }
}
