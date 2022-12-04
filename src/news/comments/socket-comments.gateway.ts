import {
    SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer,
    OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';

import * as cookie from 'cookie';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../auth/ws-jwt.guard';
import { Socket, Server } from 'socket.io';
import { CommentsService } from './comments.service';
import { OnEvent } from '@nestjs/event-emitter';

export type Comment = { message: string; newsId: number };

@WebSocketGateway()
export class SocketCommentsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly commentsService: CommentsService) { }

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('addComment')
    async handleMessage(client: Socket, comment: Comment): Promise<void> {
        const { newsId, message } = comment;
        // Извлекаем объект пользователя, который установлен в ws-jwt.guard.ts
        const userId: number = client.data.user.id;
        // Создаём комментарий
        const commentsEntity = await this.commentsService.create(newsId, userId, message);
        // Оповещаем пользователей комнаты о новом комментарии
        this.server.to(newsId.toString()).emit('newComment', commentsEntity);
    }

    afterInit(server: Server): void {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    async handleConnection(client: Socket, ...args: any[]): Promise<void> {
        const { newsId } = client.handshake.query;
        // После подключения пользователя к веб-сокету, подключаем его в комнату
        client.join(newsId);
        this.logger.log(`Client connected: ${client.id}`);
    }

    @OnEvent('comment.delete')
    handleDeleteCommentEvent(payload) {
        // Извлечём данные, переданные в событии
        const { commentId, newsId } = payload;
        // Произведём отправку сообщения об удалении комментария в комнату под  newsId
        this.server.to(newsId.toString()).emit('deleteComment', { id: commentId });
    }

    @OnEvent('comment.update')
    handleUpdateCommentEvent(payload) {
        // Извлечём данные, переданные в событии
        const { commentId, newsId, comment } = payload;
        // Произведём отправку сообщения об изменении комментария в комнату под newsId
        this.server.to(newsId.toString()).emit('updateComment', { id: commentId, comment });
    }
}