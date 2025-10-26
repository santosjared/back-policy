import { Module } from '@nestjs/common';
import { ConfirmedService } from './confirmed.service';
import { ConfirmedController } from './confirmed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Confirmed, ConfirmedSchema } from './schema/confirmed.schema';
import { Infractor, InfractorSchema } from './schema/infractor.schema';
import { TypeComplaint, TypeComplaintSchema } from 'src/complaints/schema/type-complaints.schema';
import { Atendidos, AtendidosSchema } from 'src/atendidos/schema/atendidos.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name: Confirmed.name, schema:ConfirmedSchema },
    { name: Infractor.name, schema:InfractorSchema },
    { name: TypeComplaint.name, schema:TypeComplaintSchema},
    { name: Atendidos.name, schema:AtendidosSchema}
  ])],
  controllers: [ConfirmedController],
  providers: [ConfirmedService],
})
export class ConfirmedModule {}
