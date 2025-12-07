import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schema/clients.schema';
import { Codes, CodesSchema } from './schema/codes.schema';
import { CodesService } from './codes.service';
import { MailService } from './mail.service';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';

@Module({

  imports: [MongooseModule.forFeature([
    { name: Client.name, schema: ClientSchema },
    { name: Codes.name, schema: CodesSchema },
    {name: Auth.name, schema:AuthSchema }
  ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService, CodesService, MailService],
})
export class ClientsModule { }
