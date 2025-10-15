import { Module } from '@nestjs/common';
import { ShitsService } from './shits.service';
import { ShitsController } from './shits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shits, ShitSchema } from './schema/shits.schema';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { HourRange, HourRangeSchema } from './schema/hour-rage.schema';
import { Services, ServicesSchema } from './schema/services.schema';
import { UserServices, UserServicesSchema } from './schema/user-services.schema';
import { UserShift, UserShiftSchema } from './schema/user-shift.schema';
import { Zone, ZoneSChema } from './schema/zone.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Shits.name, schema: ShitSchema },
    { name: Users.name, schema: UsersSchema },
    { name: HourRange.name, schema: HourRangeSchema },
    { name: Services.name, schema: ServicesSchema },
    { name: UserServices.name, schema: UserServicesSchema },
    { name: UserShift.name, schema: UserShiftSchema },
    { name: Zone.name, schema: ZoneSChema },
  ])],
  controllers: [ShitsController],
  providers: [ShitsService],
})
export class ShitsModule {}
