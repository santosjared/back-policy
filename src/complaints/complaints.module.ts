import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeComplaint, TypeComplaintSchema } from './schema/type-complaints.schema';
import { Kin, KinSchema } from './schema/kin.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports:[

  MongooseModule.forFeature([
    { name:TypeComplaint.name, schema:TypeComplaintSchema },
    { name: Kin.name, schema:KinSchema }
  ]),
  CaslModule
],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
