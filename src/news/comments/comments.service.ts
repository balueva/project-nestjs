import { Injectable } from '@nestjs/common';
import { Comment } from './comments.types';
import { CommentsPropsDto } from './dtos/comments-props.dto';

@Injectable()
export class CommentsService {
    private readonly comments = {};

    async create(newsId: string, userComment: CommentsPropsDto): Promise<number> {
        if (!this.comments?.[newsId])
            this.comments[newsId] = [];

        return this.comments[newsId].push({ id: Date.now().toString(), text: userComment.text, author: userComment.author, avatar: userComment.avatar });
    }

    async findAll(newsId: string): Promise<Comment[]> {
        if (this.comments?.[newsId])
            return this.comments?.[newsId]
        else
            return [];
    }

    async update(newsId: string, commentId: string, newComment: CommentsPropsDto): Promise<boolean> {
        let idx: number = -1;

        if (this.comments?.[newsId])
            idx = this.comments[newsId].findIndex(item => item.id === commentId);

        if (idx >= 0) {
            this.comments[newsId][idx] = { ...this.comments[newsId][idx], ...newComment };
            return true;
        }
        else
            return false;
    }

    async delete(newsId: string, commentId: string): Promise<boolean> {
        const idx = (this.comments?.[newsId]) ? this.comments[newsId].findIndex(item => item.id === commentId) : -1;
        if (idx >= 0) {
            this.comments[newsId].splice(idx, 1);
            return true;
        }
        else
            return false;
    }

    async deleteAll(newsId: string): Promise<boolean> {
        if (this.comments?.[newsId]) {
            delete this.comments[newsId];
            return true;
        }
        return false;
    }
}
