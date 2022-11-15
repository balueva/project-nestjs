import { Module, forwardRef } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [forwardRef(() => CommentsModule), MailModule, UsersModule, CategoriesModule,
  TypeOrmModule.forFeature([NewsEntity])],
  exports: [NewsService]
})
export class NewsModule { }
