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

@Module({
  imports:[MongooseModule.forFeature([
    { name:Atendidos.name, schema:AtendidosSchema },
    { name:UserPatrols.name, schema:UserPatrolsSchema},
    { name:Marker.name, schema:MarkerSchema},
    { name:Type.name, schema:TypeSchema},
    { name:Patrols.name, schema:PatrolsSchema},
    { name: Shits.name, schema: ShitSchema}
  ])],
  controllers: [AtendidosController],
  providers: [AtendidosService],
})
export class AtendidosModule {}
