import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintsClient, ComplaintsClientSchema } from './schema/complaints.schema';
import { ComplaintsClientController } from './complaints.controller';
import { ComplaintsClientService } from './complaints.service';
import { NotificationGatewey } from 'src/notifications/gateway';
import { Client, ClientSchema } from '../schema/clients.schema';
import { TypeComplaint, TypeComplaintSchema } from 'src/complaints/schema/type-complaints.schema';
import { Kin, KinSchema } from 'src/complaints/schema/kin.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ComplaintsClient.name, schema: ComplaintsClientSchema },
            { name: Client.name, schema: ClientSchema },
            { name: TypeComplaint.name, schema: TypeComplaintSchema },
            { name: Kin.name, schema: KinSchema }
        ])
    ],
    controllers:[ComplaintsClientController],
    providers:[ComplaintsClientService, NotificationGatewey]
})
export class complaintsClientModule { }