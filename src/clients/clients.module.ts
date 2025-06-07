import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schema/clients.schema';
import { Rol, RolSchema } from 'src/roles/schema/roles.schema';
import { Codes, CodesSchema } from './schema/codes.schema';
import { CodesService } from './codes.service';
import { MailService } from './mail.service';

@Module({

  imports:[MongooseModule.forFeature([
    {
      name:Client.name,
      schema:ClientSchema
    },
    {
      name:Rol.name,
      schema:RolSchema,
    },
  ]),
  MongooseModule.forFeature([{
    name:Codes.name,
    schema:CodesSchema
  }])
],
  controllers: [ClientsController],
  providers: [ClientsService, CodesService, MailService],
})
export class ClientsModule {}
