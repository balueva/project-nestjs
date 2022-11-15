import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { NewsEntity } from '../news/news.entity';
import { CommentsEntity } from '../news/comments/comments.entity';

@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('text')
    email: string;

    @Column('text')
    role: string;

    @Column('text', { nullable: true })
    avatar: string;


    @OneToMany(() => NewsEntity, (news) => news.user)
    news: NewsEntity[];

    @OneToMany(() => CommentsEntity, (comments) => comments.user)
    comments: CommentsEntity[];
}
