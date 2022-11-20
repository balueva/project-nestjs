import { Module, forwardRef } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { UsersModule } from 'src/users/users.module';
import { NewsModule } from '../news.module';
//import { NewsService } from '../news.service';
@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [TypeOrmModule.forFeature([CommentsEntity]), UsersModule, forwardRef(() => NewsModule)]
})
export class CommentsModule { }
