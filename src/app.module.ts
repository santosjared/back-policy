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
import { ShitsModule } from './shits/shits.module';
import { PatrolsModule } from './patrols/patrols.module';
import { AtendidosModule } from './atendidos/atendidos.module';
import { ConfirmedModule } from './confirmed/confirmed.module';
import { SocketModule } from './providers/socket.module';
import { AsignadosModule } from './asignados/asignados.module';

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
    ShitsModule,
    PatrolsModule,
    AtendidosModule,
    ConfirmedModule,
    SocketModule,
    AsignadosModule
  ],
})
export class AppModule {}
