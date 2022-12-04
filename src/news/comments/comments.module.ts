import { Module, forwardRef } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { UsersModule } from 'src/users/users.module';
import { NewsModule } from '../news.module';
//import { NewsService } from '../news.service';
import { SocketCommentsGateway } from './socket-comments.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { UsersEntity } from 'src/users/users.entity';
import { NewsEntity } from '../news.entity';

/*
@Module({
  providers: [CommentsService, SocketCommentsGateway, UsersService],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [TypeOrmModule.forFeature([CommentsEntity]),
  TypeOrmModule.forFeature([UsersEntity]), TypeOrmModule.forFeature([NewsEntity]), AuthModule]
})

*/

@Module({
  providers: [CommentsService, SocketCommentsGateway],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [TypeOrmModule.forFeature([CommentsEntity]), UsersModule, forwardRef(() => NewsModule), AuthModule]
})



/**
 @Module({
  providers: [CommentsService, SocketCommentsGateway, UsersService],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [TypeOrmModule.forFeature([CommentsEntity]),
  TypeOrmModule.forFeature([UsersEntity]), forwardRef(() => NewsModule), AuthModule]
}) 

 */

export class CommentsModule { }