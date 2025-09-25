import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, RolSchema } from './schema/roles.schema';
import { Permission, PermissionsSchema } from 'src/permissions/schema/persmissions.schema';
import { CaslModule } from 'src/casl/casl.module';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';

@Module({
  imports:[MongooseModule.forFeature([
    {name:Rol.name,
      schema:RolSchema
    }
  ]),
  MongooseModule.forFeature([{
    name:Permission.name,
    schema:PermissionsSchema
  }]),
  CaslModule,
],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
