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

  async update(id: string, updateConfirmedDto: UpdateConfirmedDto) {
  
  if (updateConfirmedDto.otra_denuncia) {
    const { _id } = await this.typeComplaintModel.create({ name: updateConfirmedDto.otra_denuncia });
    updateConfirmedDto.tipo_denuncia = _id.toString();
    delete updateConfirmedDto.otra_denuncia;
  }

  const confirmed = await this.confirmedModel.findById(id).populate('infractores');
  if (!confirmed) throw new Error('Denuncia no encontrada');

  const existingIds = confirmed.infractores.map((i: any) => i._id.toString());
  const newInfractores = updateConfirmedDto.infractores || [];

  const toUpdate = newInfractores.filter((i) => i._id && existingIds.includes(i._id));
  const toCreate = newInfractores.filter((i) => !i._id);
  const toDelete = existingIds.filter((id) => !newInfractores.some((i) => i._id === id));

  const created = await Promise.all(
    toCreate.map(async (infractor) => {
      const { _id } = await this.infractorModel.create(infractor);
      return _id.toString();
    })
  );

  await Promise.all(
    toUpdate.map(async (infractor) => {
      await this.infractorModel.findByIdAndUpdate(infractor._id, infractor);
    })
  );
  await Promise.all(
    toDelete.map(async (infractorId) => {
      await this.infractorModel.findByIdAndDelete(infractorId);
    })
  );

  const finalIds = [
    ...toUpdate.map((i) => i._id),
    ...created
  ];
  const updatedConfirmed = await this.confirmedModel.findByIdAndUpdate(
    id,
    {
      ...updateConfirmedDto,
      infractores: finalIds
    },
    { new: true }
  );

  return updatedConfirmed;
}

}
