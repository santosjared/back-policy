import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client, ClientSchema } from 'src/clients/schema/clients.schema';
import { SingIn, SingInSchema } from './schema/sing-in.schema';
import { GoogleAuthService } from './google-auth.service';
import { Rol, RolSchema } from 'src/roles/schema/roles.schema';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Client.name, schema: ClientSchema },
      { name: SingIn.name, schema: SingInSchema },
      { name: Rol.name, schema: RolSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService, JwtStrategy],
})
export class AuthModule {}
