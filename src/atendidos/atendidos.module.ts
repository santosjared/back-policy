import { Module } from '@nestjs/common';
import { AtendidosService } from './atendidos.service';
import { AtendidosController } from './atendidos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Atendidos, AtendidosSchema } from './schema/atendidos.schema';
import { UserPatrols, UserPatrolsSchema } from './schema/user-patrols.schema';
import { Marker, MarkerSchema } from 'src/patrols/schema/marker.schema';
import { Type, TypeSchema } from 'src/patrols/schema/type.schema';
import { Patrols, PatrolsSchema } from 'src/patrols/schema/patrols.schema';
import { Shits, ShitSchema } from 'src/shits/schema/shits.schema';
import { UserShift, UserShiftSchema } from 'src/shits/schema/user-shift.schema';
import { ComplaintsClient, ComplaintsClientSchema } from 'src/clients/complaints/schema/complaints.schema';
import { Client, ClientSchema } from 'src/clients/schema/clients.schema';
import { TypeComplaint, TypeComplaintSchema } from 'src/complaints/schema/type-complaints.schema';
import { Kin, KinSchema } from 'src/complaints/schema/kin.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Atendidos.name, schema:AtendidosSchema },
    { name:UserPatrols.name, schema:UserPatrolsSchema},
    { name:Marker.name, schema:MarkerSchema},
    { name:Type.name, schema:TypeSchema},
    { name:Patrols.name, schema:PatrolsSchema},
    { name: Shits.name, schema: ShitSchema},
    { name: UserShift.name, schema: UserShiftSchema},
    { name: ComplaintsClient.name, schema: ComplaintsClientSchema},
    { name: Client.name, schema: ClientSchema},
    { name: TypeComplaint.name, schema: TypeComplaintSchema},
    { name: Kin.name, schema: KinSchema},
  ])],
  controllers: [AtendidosController],
  providers: [AtendidosService],
})
export class AtendidosModule {}
