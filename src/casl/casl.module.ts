import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslAbilityFactory } from 'src/config/acl';
import { Permission, PermissionsSchema } from 'src/roles/schema/persmissions.schema';
import { RolesService } from 'src/roles/roles.service';
import { Rol, RolSchema } from 'src/roles/schema/roles.schema';

@Module({
    imports:[MongooseModule.forFeature([
        {name:Rol.name,
          schema:RolSchema
        }
      ]),
      MongooseModule.forFeature([{
        name:Permission.name,
        schema:PermissionsSchema
      }]),],
    providers: [CaslAbilityFactory,RolesService],
    exports: [CaslAbilityFactory],
})
export class CaslModule { }
