import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { JwtModule} from '@nestjs/jwt';
import  environment  from 'src/config/environment'
import { ConfigModule } from '@nestjs/config';
import getConfig from 'src/config/environment'

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal:true,
      load:[environment]
    }),
    JwtModule.register({
      global: true,
      secret:getConfig().JWT_SECRET,
      signOptions:{expiresIn:'1h'}
    }),
    MongooseModule.forFeature([{
    name:Users.name,
    schema:UsersSchema
  }]),
],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
