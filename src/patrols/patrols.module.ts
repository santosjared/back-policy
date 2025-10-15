import { Module } from '@nestjs/common';
import { PatrolsService } from './patrols.service';
import { PatrolsController } from './patrols.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Patrols, PatrolsSchema } from './schema/patrols.schema';
import { Marker, MarkerSchema } from './schema/marker.schema';
import { Type, TypeSchema } from './schema/type.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Patrols.name, schema: PatrolsSchema },
    { name: Marker.name, schema: MarkerSchema },
    { name: Type.name, schema: TypeSchema },
  ])],
  controllers: [PatrolsController],
  providers: [PatrolsService],
})
export class PatrolsModule {}
