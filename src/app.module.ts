import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ClientsModule } from './clients/clients.module';
import environment from './config/environment';
import getConfig from './config/environment'
import { complaintsClientModule } from './clients/complaints/complaints.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal:true,
    load:[environment]
    
  }),
    MongooseModule.forRoot(getConfig().MONGO_URI), 
    AuthModule, 
    UsersModule, 
    ComplaintsModule, 
    RolesModule,
    PermissionsModule, 
    ClientsModule, 
    complaintsClientModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'images'),
      serveRoot: '/images',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'videos'),
      serveRoot: '/videos',
    }),
  ],
})
export class AppModule {}
