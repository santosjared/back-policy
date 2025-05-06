import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Denuncias, DenunciasSchema } from './schema/denuncias.schema';
import { TypeComplaint, TypeComplaintSchema } from './schema/type-complaints.schema';
import { Kin, KinSchema } from './schema/kin.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Denuncias.name,
    schema:DenunciasSchema
  }]),
  MongooseModule.forFeature([
    {
      name:TypeComplaint.name,
      schema:TypeComplaintSchema
    }
  ]),
  MongooseModule.forFeature([
    {
      name: Kin.name,
      schema:KinSchema
    }
  ])
],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
