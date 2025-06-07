import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { JwtModule} from '@nestjs/jwt';
import  environment  from 'src/config/environment'
import { ConfigModule } from '@nestjs/config';
import getConfig from 'src/config/environment'
import { Client, ClientSchema } from 'src/clients/schema/clients.schema';
import { SingIn, SingInSchema } from './schema/sing-in.schema';
import { GoogleAuthService } from './google-auth.service';
import { Rol, RolSchema } from 'src/roles/schema/roles.schema';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal:true,
      load:[environment]
    }),
    JwtModule.register({
      global: true,
      secret:getConfig().JWT_SECRET,
      signOptions:{expiresIn:'15m'}
    }),
    MongooseModule.forFeature([{
    name:Users.name,
    schema:UsersSchema,
  }]),
  MongooseModule.forFeature([{
    name:Client.name,
    schema:ClientSchema
  }]),
  MongooseModule.forFeature([{
    name:SingIn.name,
    schema:SingInSchema
  }]),
  MongooseModule.forFeature([{
    name:Rol.name,
    schema:RolSchema
  }])
],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService],
})
export class AuthModule {}
