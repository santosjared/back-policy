import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('✅ Cliente conectado:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('❌ Cliente desconectado:', client.id);
  }

  async emitNotification() {
    const data = await this.socketService.findComplaint();
    this.server.emit('onNotification', data);
  }

  @SubscribeMessage('emitNotification')
  async handleNotification() {
    console.log('📩 Evento emitNotification recibido');
    const data = await this.socketService.findComplaint();
    this.server.emit('onNotification', data);
  }
}
