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
import { Services, ServicesSchema } from 'src/shits/schema/services.schema';
import { Zone, ZoneSChema } from 'src/shits/schema/zone.schema';
import { ServicesSeedService } from './services-seed.service';
import { ZoneSeedService } from './zone-seed.service';
import { Marker, MarkerSchema } from 'src/patrols/schema/marker.schema';
import { Type, TypeSchema } from 'src/patrols/schema/type.schema';
import { MarkerSeedService } from './marker-seed.services';
import { TypeSeedService } from './type-seed.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment]

    }),
    MongooseModule.forRoot(getConfig().MONGO_URI),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Rol.name, schema: RolSchema },
      { name: Permission.name, schema: PermissionsSchema },
      { name: TypeComplaint.name, schema: TypeComplaintSchema },
      { name: Kin.name, schema: KinSchema },
      { name: Services.name, schema: ServicesSchema },
      { name: Zone.name, schema: ZoneSChema },
      { name: Marker.name, schema: MarkerSchema },
      { name: Type.name, schema: TypeSchema },
    ]),
  ],
  providers: [UserSeedService, DenunciasSeedService, KindsSeedService, ServicesSeedService, ZoneSeedService, TypeSeedService, MarkerSeedService],
})
export class SeedModule { }
