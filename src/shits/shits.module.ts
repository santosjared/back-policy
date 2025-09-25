import { Module } from '@nestjs/common';
import { ShitsService } from './shits.service';
import { ShitsController } from './shits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shits, ShitSchema } from './schema/shits.schema';
import { Users, UsersSchema } from 'src/users/schema/users.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Shits.name, schema: ShitSchema },
    { name: Users.name, schema: UsersSchema }
  ])],
  controllers: [ShitsController],
  providers: [ShitsService],
})
export class ShitsModule {}
