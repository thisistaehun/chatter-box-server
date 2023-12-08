import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { interval, take } from 'rxjs';
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
    Logger.log(`Client connected: ${client.id}`, 'ChatGateway');
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`, 'ChatGateway');
  }

  @SubscribeMessage('stream')
  async onEvent(@MessageBody() data: ChatMessage) {
    // AI Server socket 통신으로 데이터 받아오기
    const message = `안녕하세요. 저는 온톨이입니다. 여러분에게 도움이 되는 답변을 드리겠습니다. 채팅은 실시간으로 진행되며, 채팅방을 나가면 소켓 연결이 해제됩니다. <EndOfText>`;

    const responseArray = message.split('');

    return interval(400)
      .pipe(take(responseArray.length))
      .subscribe((index: number) => {
        this.server.emit(`stream-${data.sender}`, {
          sender: 'server',
          message: responseArray[index],
          timestamp: new Date(),
        });
      });
}
