import { Module } from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { DenunciasController } from './denuncias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Denuncias, DenunciasSchema } from './schema/denuncias.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Denuncias.name,
    schema:DenunciasSchema
  }])],
  controllers: [DenunciasController],
  providers: [DenunciasService],
})
export class DenunciasModule {}
