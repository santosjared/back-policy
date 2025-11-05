import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ComplaintsClient, ComplaintsClientSchema } from "src/clients/complaints/schema/complaints.schema";
import { TypeComplaint, TypeComplaintSchema } from "src/complaints/schema/type-complaints.schema";
import { NotificationGateway } from "./socket.provider";
import { SocketService } from "./socket.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ComplaintsClient.name, schema: ComplaintsClientSchema },
      { name: TypeComplaint.name, schema: TypeComplaintSchema }
    ])
  ],
  providers: [NotificationGateway, SocketService], // ✅ Aquí debe estar el Gateway
})
export class SocketModule {}
