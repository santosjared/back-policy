import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
})
export class NotificationGateway {
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  async emitNotification() {
    const data = await this.socketService.findComplaint();
    this.server.emit('onNotification', data);
  }

  @SubscribeMessage('emitNotification')
  async handleNotification() {
    const data = await this.socketService.findComplaint();
    this.server.emit('onNotification', data);
  }
}
