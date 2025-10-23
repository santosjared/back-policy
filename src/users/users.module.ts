import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/users.schema';
import { Rol, RolSchema } from 'src/roles/schema/roles.schema';
import { CaslModule } from 'src/casl/casl.module';
import { Grade, GradeSchema } from './schema/grade.schema';
import { Post, PostSchema } from './schema/post.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Users.name, schema:UsersSchema },
    { name:Rol.name, schema:RolSchema },
    { name:Grade.name, schema:GradeSchema },
    { name:Post.name, schema:PostSchema }

  ]),
  MongooseModule.forFeature([]),
  CaslModule
],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
