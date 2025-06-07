import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { RolesModule } from './roles/roles.module';
import { ClientsModule } from './clients/clients.module';
import environment from './config/environment';
import getConfig from './config/environment'
import { complaintsClientModule } from './clients/complaints/complaints.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ActionModule } from './action/action.module';
import { SubjectModule } from './subject/subject.module';
import { PermissionsModule } from './permissions/permissions.module';

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
    ActionModule,
    SubjectModule,
    PermissionsModule,
  ],
})
export class AppModule {}
