import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, RolSchema } from './schema/roles.schema';

@Module({
  imports:[MongooseModule.forFeatureAsync([
    {name:Rol.name,
      useFactory:()=>RolSchema
    }
  ])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
