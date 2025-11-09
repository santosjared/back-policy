import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintsClient, ComplaintsClientSchema } from 'src/clients/complaints/schema/complaints.schema';
import { Client, ClientSchema } from 'src/clients/schema/clients.schema';
import { TypeComplaint, TypeComplaintSchema } from 'src/complaints/schema/type-complaints.schema';
import { Kin, KinSchema } from 'src/complaints/schema/kin.schema';
import { AsignadosController } from './asignados.controller';
import { AsignadosService } from './asignados.service';
import { Atendidos, AtendidosSchema } from 'src/atendidos/schema/atendidos.schema';
import { UserShift, UserShiftSchema } from 'src/shits/schema/user-shift.schema';
import { Patrols, PatrolsSchema } from 'src/patrols/schema/patrols.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Atendidos.name, schema:AtendidosSchema },
    { name: ComplaintsClient.name, schema: ComplaintsClientSchema},
    { name: Client.name, schema: ClientSchema},
    { name: TypeComplaint.name, schema: TypeComplaintSchema},
    { name: Kin.name, schema: KinSchema},
    { name: UserShift.name, schema: UserShiftSchema},
    { name: Patrols.name, schema: PatrolsSchema},
  ]),
  CaslModule
],
  controllers: [AsignadosController],
  providers: [AsignadosService],
})
export class AsignadosModule {}