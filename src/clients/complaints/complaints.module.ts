import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintsClient, ComplaintsClientSchema } from './schema/complaints.schema';
import { ComplaintsClientController } from './complaints.controller';
import { ComplaintsClientService } from './complaints.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: ComplaintsClient.name,
                schema: ComplaintsClientSchema
            }
        ])
    ],
    controllers:[ComplaintsClientController],
    providers:[ComplaintsClientService]
})
export class complaintsClientModule { }