import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/users.schema';
import { Gender, GenderSchema } from './schema/gender.schema';
import { Contry, ContrySchema } from './schema/contry.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Users.name,
    schema:UsersSchema
  }
  ]),
  MongooseModule.forFeature([{
    name:Gender.name,
    schema:GenderSchema
  }]),
  MongooseModule.forFeature([{
    name:Contry.name,
    schema:ContrySchema
  }])
],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
