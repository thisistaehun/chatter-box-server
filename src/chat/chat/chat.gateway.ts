import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Socket 타입 추가
import { ChatMessage } from './chat.message.type';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Socket 타입으로 변경
    Logger.log(`Client connected: ${client.id}`, 'ChatGateway');
  }

  handleDisconnect(client: Socket) {
    // Socket 타입으로 변경
    Logger.log(`Client disconnected: ${client.id}`, 'ChatGateway');
  }

  @SubscribeMessage('chat')
  handleMessage(client: Socket, message: ChatMessage) {
    console.log(message);
    // ChatMessage 타입으로 변경
    // 클라이언트에서 받은 메시지를 다른 모든 클라이언트에게 전송
    this.server.emit('chat', message);
  }
}
