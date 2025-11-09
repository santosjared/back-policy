import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TypeComplaint, TypeComplaintsDocument } from './schema/type-complaints.schema';
import { Kin, KinDocument } from './schema/kin.schema';
import { CreateTypeComplaintsDto } from './dto/create-type-complaints.dto';
import { UpdateTypeComplaintsDto } from './dto/update-type-complaints.dto';
import { FiltersTypeComplaintsDto } from './dto/filters-typeComplaints.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectModel(TypeComplaint.name) private readonly typeComplaintsService: Model<TypeComplaintsDocument>,
    @InjectModel(Kin.name) private readonly kinService: Model<KinDocument>
  ) { }
  async create(createTypeComplaintsDto: CreateTypeComplaintsDto) {
    return await this.typeComplaintsService.create(createTypeComplaintsDto);
  }

  async update(id: string, updateTypeComplaintDto: UpdateTypeComplaintsDto) {
    return await this.typeComplaintsService.findByIdAndUpdate(id, updateTypeComplaintDto);
  }

  async remove(id: string) {
    return await this.typeComplaintsService.findByIdAndDelete(id);
  }
  async findAllTypeComplaint(filters: FiltersTypeComplaintsDto) {

    const { field = '', skip = 0, limit = 10 } = filters

    let query: any = {};

    if (field) {
      const orFilters: any[] = [
        { name: { $regex: field, $options: 'i' } },
        { description: { $regex: field, $options: 'i' } }
      ];
      query = { ...query, $or: orFilters };
    }

    const safeLimit = Math.min(limit, 100);

    const result = await this.typeComplaintsService.find(query)
      .select('-__v')
      .skip(skip)
      .limit(safeLimit)
      .exec();

    const total = await this.typeComplaintsService.countDocuments(query);
    return { result, total }

  }
  async findAllKing() {
    return await this.kinService.find();
  }
}
