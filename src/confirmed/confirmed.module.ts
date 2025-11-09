import { Module } from '@nestjs/common';
import { ConfirmedService } from './confirmed.service';
import { ConfirmedController } from './confirmed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Confirmed, ConfirmedSchema } from './schema/confirmed.schema';
import { Infractor, InfractorSchema } from './schema/infractor.schema';
import { TypeComplaint, TypeComplaintSchema } from 'src/complaints/schema/type-complaints.schema';
import { Atendidos, AtendidosSchema } from 'src/atendidos/schema/atendidos.schema';
import { UserPatrols, UserPatrolsSchema } from 'src/atendidos/schema/user-patrols.schema';
import { UserShift, UserShiftSchema } from 'src/shits/schema/user-shift.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Confirmed.name, schema: ConfirmedSchema },
    { name: Infractor.name, schema: InfractorSchema },
    { name: TypeComplaint.name, schema: TypeComplaintSchema },
    { name: Atendidos.name, schema: AtendidosSchema },
    { name: UserPatrols.name, schema: UserPatrolsSchema },
    { name: UserShift.name, schema: UserShiftSchema },
  ]),
  CaslModule
],
  controllers: [ConfirmedController],
  providers: [ConfirmedService],
})
export class ConfirmedModule { }
