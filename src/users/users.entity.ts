import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { NewsEntity } from '../news/news.entity';
import { CommentsEntity } from '../news/comments/comments.entity';
import { Role } from '../auth/roles/role.enum';
import { IsEnum } from 'class-validator';

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
    password: string;

    @Column('text')
    @IsEnum(Role)
    roles: Role;

    @Column('text', { nullable: true })
    avatar: string;


    @OneToMany(() => NewsEntity, (news) => news.user)
    news: NewsEntity[];

    @OneToMany(() => CommentsEntity, (comments) => comments.user)
    comments: CommentsEntity[];
}
