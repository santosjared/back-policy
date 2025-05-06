import { Injectable } from '@nestjs/common';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';
import { Denuncias, DenunciasDocument } from './schema/denuncias.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TypeComplaint, TypeComplaintsDocument } from './schema/type-complaints.schema';
import { Kin, KinDocument } from './schema/kin.schema';

@Injectable()
export class ComplaintsService {
  constructor(@InjectModel(Denuncias.name)private readonly serviceDenuncias:Model<DenunciasDocument>,
  @InjectModel(TypeComplaint.name) private readonly typeComplaintsService:Model<TypeComplaintsDocument>,
  @InjectModel(Kin.name) private readonly kinService:Model<KinDocument>
){}
  async create(createDenunciaDto: CreateDenunciaDto) {
    return await this.serviceDenuncias.create(createDenunciaDto);
  }

  async findAll() {
    return await this.serviceDenuncias.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} denuncia`;
  }

  update(id: number, updateDenunciaDto: UpdateDenunciaDto) {
    return `This action updates a #${id} denuncia`;
  }

  remove(id: number) {
    return `This action removes a #${id} denuncia`;
  }
  async findAllTypeComplaint () {
    const complaints = await this.typeComplaintsService.find()
    return await this.typeComplaintsService.find();
  }
  async findAllKing () {
    return await this.kinService.find();
  }
}
