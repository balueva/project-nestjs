import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
    UpdateDateColumn, ManyToOne
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity';
import { NewsEntity } from '../news.entity';

@Entity('comments')
export class CommentsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    message: string;

    @ManyToOne(() => UsersEntity, (user) => user.comments)
    user: UsersEntity;

    @ManyToOne(() => NewsEntity, (news) => news.comment)
    news: NewsEntity;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

