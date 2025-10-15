import { Injectable } from '@nestjs/common';
import { CreateShitDto } from './dto/create-shit.dto';
import { UpdateShitDto } from './dto/update-shit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shits, ShitsDocument } from './schema/shits.schema';
import { Model } from 'mongoose';
import { FilterShitDto } from './dto/filter-shit.dto';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { Services, ServicesDocument } from './schema/services.schema';
import { Zone, ZoneDocument } from './schema/zone.schema';
import { HourRange, HourRangeDocument } from './schema/hour-rage.schema';
import { UserServices, UserServicesDocument } from './schema/user-services.schema';
import { UserShift, UserShiftDocument } from './schema/user-shift.schema';

@Injectable()
export class ShitsService {
  constructor(@InjectModel(Shits.name) private shitsModel: Model<ShitsDocument>,
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    @InjectModel(Services.name) private servicesModel: Model<ServicesDocument>,
    @InjectModel(Zone.name) private zoneModel: Model<ZoneDocument>,
    @InjectModel(HourRange.name) private hourRangeModel: Model<HourRangeDocument>,
    @InjectModel(UserServices.name) private userServicesModel: Model<UserServicesDocument>,
    @InjectModel(UserShift.name) private userShiftModel: Model<UserShiftDocument>,
  ) { }

  async create(createShitDto: CreateShitDto) {
    const updateHrs = await Promise.all(
      createShitDto.hrs.map(async (hr) => {
        const updateServices = await Promise.all(
          hr?.services?.map(async (service) => {
            const updateShiftUser = await Promise.all(
              service?.users?.map( async (user) => {
                const userDb = await this.userShiftModel.findById(user._id)
                if(userDb){
                  const { _id } = await this.userShiftModel.findByIdAndUpdate(user._id, user);
                  return _id.toString()
                }
                const { _id } = await this.userShiftModel.create(user);
                return _id.toString()
              }) || []
            )
            let data = { ...service };
            if (service.otherService) {
              const createdService = await this.servicesModel.create({ name: service.otherService });
              data.services = createdService._id.toString();
              delete data.otherService;
            }
            if (service.otherZone) {
              const createdZone = await this.zoneModel.create({ name: service.otherZone });
              data.zone = createdZone._id.toString();
              delete data.otherZone;
            }
            const serviceDB = await this.userServicesModel.findById(data._id);
            if(serviceDB){
              const { _id } = await this.userServicesModel.findByIdAndUpdate(data._id, {...data, users:updateShiftUser})
              return _id.toString()
            }
            const { _id } = await this.userServicesModel.create({...data, users:updateShiftUser})
            return _id.toString()
          })||[]
        )
        const hrDB = await this.hourRangeModel.findById(hr._id);
        if(hrDB){
          const { _id } = await this.hourRangeModel.findByIdAndUpdate(hr._id, {...hr, services:updateServices});
          return _id.toString()
        }
        const { _id } = await this.hourRangeModel.create({...hr, services:updateServices});
        return _id.toString()
      })||[]
    )
    return await this.shitsModel.create({...createShitDto, hrs:updateHrs});
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
      ]
    }

    const total = await this.shitsModel.countDocuments(query).exec()
    const result = await this.shitsModel
      .find(query)
      .populate('supervisor', '-password')
      .populate('hrs')
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .exec()

    return { total, result }
  }

 async findOne(id: string) {
  return await this.shitsModel.findById(id)
    .populate('supervisor', '-password')
    .populate({
      path: 'hrs',
      model: 'HourRange',
      select: '-__v',
      populate: {
        path: 'services',
        model: 'UserServices',
        select: '-__v',
        populate: [
          {
            path: 'users',
            model: 'UserShift',
            select: '-__v',
            populate: {
              path: 'user',
              model: 'Users',
              select: '-__v'
            }
          },
          {
            path: 'zone',
            model: 'Zone',
            select: '-__v'
          },
          {
            path: 'services',
            model: 'Services',
            select: '-__v'
          }
        ]
      }
    }).select('-__v -createdAt -updatedAt')
    .exec();
}

  async update(id: string, updateShitDto: UpdateShitDto) {

    const updateHrs = await Promise.all(
      updateShitDto.hrs.map(async (hr) => {
        const updateServices = await Promise.all(
          hr?.services?.map(async (service) => {
            const updateShiftUser = await Promise.all(
              service?.users?.map( async (user) => {
                const userDb = await this.userShiftModel.findById(user._id)
                if(userDb){
                  const { _id } = await this.userShiftModel.findByIdAndUpdate(user._id, user);
                  return _id
                }
                const { _id } = await this.userShiftModel.create(user);
                return _id
              }) || []
            )
            let data = { ...service };
            if (service.otherService) {
              const createdService = await this.servicesModel.create({ name: service.otherService });
              data.services = createdService._id.toString();
              delete data.otherService;
            }
            if (service.otherZone) {
              const createdZone = await this.zoneModel.create({ name: service.otherZone });
              data.zone = createdZone._id.toString();
              delete data.otherZone;
            }
            const serviceDB = await this.userServicesModel.findById(data._id);
            if(serviceDB){
              const { _id } = await this.userServicesModel.findByIdAndUpdate(data._id, {...data, users:updateShiftUser})
              return _id
            }
            const { _id } = await this.userServicesModel.create({...data, users:updateShiftUser})
            return _id
          })||[]
        )
        const hrDB = await this.hourRangeModel.findById(hr._id);
        if(hrDB){
          const { _id } = await this.hourRangeModel.findByIdAndUpdate(hr._id, {...hr, services:updateServices});
          return _id
        }
        const { _id } = await this.hourRangeModel.create({...hr, services:updateServices});
        return _id
      })||[]
    )

    return await this.shitsModel.findByIdAndUpdate(id, {...updateShitDto, hrs:updateHrs}, { new: true }).exec();
  }


  async remove(id: string) {
    return await this.shitsModel.findByIdAndDelete(id).exec();
  }

  async users() {
    return await this.usersModel.find({ status: 'activo' }).select('-password -__v').exec();
  }
  async findAllServices() {
    return await this.servicesModel.find().select('-__v');
  }
  async findAllZones() {
    return await this.zoneModel.find().select('-__v');
  }
}
