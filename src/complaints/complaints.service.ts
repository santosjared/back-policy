import { Injectable } from '@nestjs/common';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';
import { Denuncias, DenunciasDocument } from './schema/denuncias.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TypeComplaint, TypeComplaintsDocument } from './schema/type-complaints.schema';
import { Kin, KinDocument } from './schema/kin.schema';
import { CreateTypeComplaintsDto } from './dto/create-type-complaints.dto';
import { UpdateTypeComplaintsDto } from './dto/update-type-complaints.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectModel(TypeComplaint.name) private readonly typeComplaintsService: Model<TypeComplaintsDocument>,
    @InjectModel(Kin.name) private readonly kinService: Model<KinDocument>
  ) { }
  async create(createTypeComplaintsDto: CreateTypeComplaintsDto) {
    return await this.typeComplaintsService.create(createTypeComplaintsDto);
  }

  // async findAll() {
  //   return await this.serviceDenuncias.find();
  // }

  findOne(id: number) {
    return `This action returns a #${id} denuncia`;
  }

  async update(id: string, updateTypeComplaintDto: UpdateTypeComplaintsDto) {
    return await this.typeComplaintsService.findByIdAndUpdate(id, updateTypeComplaintDto);
  }

  async remove(id: string) {
    return await this.typeComplaintsService.findByIdAndDelete(id);
  }
  async findAllTypeComplaint(filters: any) {

    const { name = '', skip = 0, limit = 10 } = filters
    const query = {
      $and: [
        {
          name: {
            $regex: name,
            $options: 'i'
          }
        },
      ]
    };
    if (filters.skip && filters.limit) {
      const result = await this.typeComplaintsService.find(query).skip(skip).limit(limit).exec();
      const total = await this.typeComplaintsService.countDocuments(query);
      return { result, total }
    }
    return await this.typeComplaintsService.find();

  }
  async findAllKing() {
    return await this.kinService.find();
  }
}
