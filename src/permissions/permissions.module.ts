import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionsSchema } from './schema/persmissions.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Permission.name,
    schema:PermissionsSchema
  }]),
  CaslModule
],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
