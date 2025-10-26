import { Injectable } from '@nestjs/common';
import { CreateConfirmedDto } from './dto/create-confirmed.dto';
import { UpdateConfirmedDto } from './dto/update-confirmed.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Confirmed, ConfirmedDocument } from './schema/confirmed.schema';
import { Model } from 'mongoose';
import { Infractor, infractorDocument } from './schema/infractor.schema';
import { TypeComplaint, TypeComplaintsDocument } from 'src/complaints/schema/type-complaints.schema';
import { Atendidos, AtendidosDocument } from 'src/atendidos/schema/atendidos.schema';

@Injectable()
export class ConfirmedService {
  constructor(@InjectModel(Confirmed.name) private readonly confirmedModel:Model<ConfirmedDocument>,
  @InjectModel(Infractor.name) private readonly infractorModel:Model<infractorDocument>,
  @InjectModel(TypeComplaint.name) private readonly typeComplaintModel:Model<TypeComplaintsDocument>,
  @InjectModel(Atendidos.name) private readonly antendidosModel:Model<AtendidosDocument>
){}
async create(createConfirmedDto: CreateConfirmedDto) {
  if(createConfirmedDto.otra_denuncia){
    const {_id } = await this.typeComplaintModel.create({name:createConfirmedDto.otra_denuncia})
      createConfirmedDto.tipo_denuncia = _id.toString()
      delete createConfirmedDto.otra_denuncia
  }
  const infractoresIds = await Promise.all(
    createConfirmedDto.infractores.map(async (infractor) => {
      const { _id } = await this.infractorModel.create(infractor);
      return _id;
    })
  );

  const confirmed = await this.confirmedModel.create({
    ...createConfirmedDto,
    infractores: infractoresIds,
  });
  await this.antendidosModel.findByIdAndUpdate(createConfirmedDto.atendido,{status:'warning', confirmed:confirmed._id.toString()})
  return confirmed
}


  findAll() {
    return `This action returns all confirmed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} confirmed`;
  }

  update(id: number, updateConfirmedDto: UpdateConfirmedDto) {
    return `This action updates a #${id} confirmed`;
  }

  remove(id: number) {
    return `This action removes a #${id} confirmed`;
  }
}
