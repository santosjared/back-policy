import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ComplaintsClient, ComplaintsClientSchema } from "src/clients/complaints/schema/complaints.schema";
import { NotificationGateway } from "./socket.provider";
import { SocketService } from "./socket.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ComplaintsClient.name, schema: ComplaintsClientSchema },
    ])
  ],
  providers: [NotificationGateway, SocketService],
})
export class SocketModule {}
