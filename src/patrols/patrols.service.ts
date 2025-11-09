import { Injectable } from '@nestjs/common';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { UpdatePatrolDto } from './dto/update-patrol.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Patrols, PatrolsDocument } from './schema/patrols.schema';
import { Model } from 'mongoose';
import { Type, TypeDocument } from './schema/type.schema';
import { Marker, MarkerDocument } from './schema/marker.schema';
import { FiltersPatrolsDto } from './dto/filters-patrols.dto';

@Injectable()
export class PatrolsService {
  constructor(@InjectModel(Patrols.name) private patrolsModel: Model<PatrolsDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(Marker.name) private markerModel: Model<MarkerDocument>,
  ) { }
  async create(createPatrolDto: CreatePatrolDto) {
    if (createPatrolDto.otherType) {
      const { _id } = await this.typeModel.create({ name: createPatrolDto.otherType })
      createPatrolDto.type = _id.toString()
      delete createPatrolDto.otherType
    }
    if (createPatrolDto.otherMarker) {
      const { _id } = await this.markerModel.create({ name: createPatrolDto.otherMarker })
      createPatrolDto.marker = _id.toString()
      delete createPatrolDto.otherMarker
    }
    return await this.patrolsModel.create(createPatrolDto);
  }

  async findAll(filters: FiltersPatrolsDto) {

    const { field = '', skip = 0, limit = 10 } = filters;

    let query: any = {};
    if (field) {
      const matchedMarkers = await this.markerModel.find({ name: { $regex: field, $options: 'i' } }).select('_id');
      const matchedTypes = await this.typeModel.find({ name: { $regex: field, $options: 'i' } }).select('_id');
      const orFilters: any[] = [
        { plaque: { $regex: field, $options: 'i' } },
        { code: { $regex: field, $options: 'i' } },
        { marker: { $in: matchedMarkers.map(r => r._id) } },
        { type: { $in: matchedTypes.map(r => r._id) } },
      ];
      query = { ...query, $or: orFilters };
    }
    const safeLimit = Math.min(limit, 100);
    const result = await this.patrolsModel.find(query)
      .populate('marker type')
      .select('-createdAt -updatedAt -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .exec();
    const total = await this.patrolsModel.countDocuments(query).exec();
    return { result, total };
  }

  async findOne(id: string) {
    return await this.patrolsModel.findById(id).exec();
  }

  async findType() {
    return await this.typeModel.find().select('-__v').exec();
  }
  async findMarker() {
    return await this.markerModel.find().select('-__v').exec();
  }
  async update(id: string, updatePatrolDto: UpdatePatrolDto) {
    if (updatePatrolDto.otherType) {
      const { _id } = await this.typeModel.create({ name: updatePatrolDto.otherType })
      updatePatrolDto.type = _id.toString()
      delete updatePatrolDto.otherType
    }
    if (updatePatrolDto.otherMarker) {
      const { _id } = await this.markerModel.create({ name: updatePatrolDto.otherMarker })
      updatePatrolDto.marker = _id.toString()
      delete updatePatrolDto.otherMarker
    }
    return await this.patrolsModel.findByIdAndUpdate(id, updatePatrolDto, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.patrolsModel.findByIdAndDelete(id).exec();
  }
}
