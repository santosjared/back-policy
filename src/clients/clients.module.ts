import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schema/clients.schema';
import { Rol, RolSchema } from 'src/roles/schema/roles.schema';

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
  ])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
