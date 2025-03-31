import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schema/clients.schema';
import { Rol, RolSchema } from 'src/roles/schema/roles.schema';

@Module({

  imports:[MongooseModule.forFeatureAsync([
    {
      name:Client.name,
      useFactory:()=>ClientSchema
    },
    {
      name:Rol.name,
      useFactory:()=>RolSchema,
    },
  ])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
