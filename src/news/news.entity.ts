import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
    ManyToOne
} from 'typeorm';
import { CategoriesEntity } from '../categories/categories.entity';
import { UsersEntity } from '../users/users.entity';
import { CommentsEntity } from './comments/comments.entity';

@Entity('news')
export class NewsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    title: string;

    @Column('text')
    description: string;

    @ManyToOne(() => UsersEntity, (user) => user.news)
    user: UsersEntity;

    @ManyToOne(() => CommentsEntity, (comment) => comment.news)
    comment: CommentsEntity;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => CategoriesEntity, (category) => category.news)
    category: CategoriesEntity;
}
