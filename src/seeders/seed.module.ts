import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { Permission, PermissionsSchema } from '../permissions/schema/persmissions.schema';
import { Rol, RolSchema } from '../roles/schema/roles.schema';
import { Users, UsersSchema } from '../users/schema/users.schema';

import { UserSeedService } from './user-seed.service';
import { DenunciasSeedService } from './denuncias-seed.service';

import environment from '../config/environment';
import getConfig from '../config/environment'
import { TypeComplaint, TypeComplaintSchema } from '../complaints/schema/type-complaints.schema';
import { Kin, KinSchema } from 'src/complaints/schema/kin.schema';
import { KindsSeedService } from './kinds-seed.service';


@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal:true,
        load:[environment]
        
      }),
    MongooseModule.forRoot(getConfig().MONGO_URI),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Rol.name, schema: RolSchema },
      { name: Permission.name, schema: PermissionsSchema },
      { name: TypeComplaint.name, schema:TypeComplaintSchema},
      { name: Kin.name, schema:KinSchema}
    ]),
  ],
  providers: [UserSeedService, DenunciasSeedService, KindsSeedService],
})
export class SeedModule {}
