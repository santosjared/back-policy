import { Injectable} from '@nestjs/common';
import { CreateShitDto } from './dto/create-shit.dto';
import { UpdateShitDto } from './dto/update-shit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shits, ShitsDocument } from './schema/shits.schema';
import { Model } from 'mongoose';
import { FilterShitDto } from './dto/filter-shit.dto';
import { Users, UsersDocument } from 'src/users/schema/users.schema';

@Injectable()
export class ShitsService {
  constructor(@InjectModel(Shits.name) private shitsModel: Model<ShitsDocument>,
  @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
) {}
  async create(createShitDto: CreateShitDto) {
    return await this.shitsModel.create(createShitDto);
  }

 async findAll(filters: any) {
    const { field = '', skip = 0, limit = 10 } = filters

    let matchedUserIds: string[] = []

    if (field) {
      const matchedUsers = await this.usersModel.find({
        $or: [
          { firstName: { $regex: field, $options: 'i' } },
          { paternalSurname: { $regex: field, $options: 'i' } },
          { maternalSurname: { $regex: field, $options: 'i' } }
        ]
      }).select('_id')
      matchedUserIds = matchedUsers.map(u => u._id.toString())
    }

    const query: any = {
      $or: [
        { date: { $regex: field, $options: 'i' } },
        { supervisor: { $in: matchedUserIds } },
        { 'hrs.name': { $regex: field, $options: 'i' } } 
      ]
    }

    const total = await this.shitsModel.countDocuments(query).exec()
    const result = await this.shitsModel
      .find(query)
      .populate('supervisor', '-password')
      .sort({ createdAt: -1  })
      .skip(Number(skip))
      .limit(Number(limit))
      .exec()

    return { total, result }
  }

  async findOne(id: string) {
    return await this.shitsModel.findById(id).populate('supervisor', '-password').exec();
  }

  async update(id: string, updateShitDto: UpdateShitDto) {
    return await this.shitsModel.findByIdAndUpdate(id, updateShitDto, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.shitsModel.findByIdAndDelete(id).exec();
  }

  async users() {
    return await this.usersModel.find({status: 'activo'}).select('-password').exec();
  }
}
