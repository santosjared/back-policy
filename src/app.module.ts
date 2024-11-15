import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import environment from './config/environment';
import getConfig from './config/environment'

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal:true,
    load:[environment]
  }),
    MongooseModule.forRoot(getConfig().MONGO_URI), AuthModule, UsersModule],
})
export class AppModule {}
