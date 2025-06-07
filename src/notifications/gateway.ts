import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors:true
})
export class NotificationGatewey{
    @WebSocketServer()
    server:Server
    emitNotification(data:any){
        this.server.emit('notification', data);
    }
}