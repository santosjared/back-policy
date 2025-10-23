import { Injectable } from '@nestjs/common';
import { CreateAtendidoDto } from './dto/create-atendido.dto';
import { UpdateAtendidoDto } from './dto/update-atendido.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Atendidos, AtendidosDocument } from './schema/atendidos.schema';
import { Model } from 'mongoose';
import { UserPatrols, UserPatrolsDocument } from './schema/user-patrols.schema';
import { FiltersAtendidoDto } from './dto/filters-atendido.dto';
import { Patrols, PatrolsDocument } from 'src/patrols/schema/patrols.schema';
import { Marker, MarkerDocument } from 'src/patrols/schema/marker.schema';
import { Type, TypeDocument } from 'src/patrols/schema/type.schema';
import { Shits, ShitsDocument } from 'src/shits/schema/shits.schema';

@Injectable()
export class AtendidosService {
  constructor(@InjectModel(Atendidos.name) private readonly atendidosModel: Model<AtendidosDocument>,
    @InjectModel(UserPatrols.name) private readonly userPatrolsModel: Model<UserPatrolsDocument>,
    @InjectModel(Patrols.name) private readonly patrolsModel: Model<PatrolsDocument>,
    @InjectModel(Marker.name) private readonly markerModel: Model<MarkerDocument>,
    @InjectModel(Type.name) private readonly typeModel: Model<TypeDocument>,
    @InjectModel(Shits.name) private readonly shitsModel: Model<ShitsDocument>
  ) { }
  async create(createAtendidoDto: CreateAtendidoDto) {
    const userPatrolsIds = await Promise.all(
      createAtendidoDto.userpatrol.map(async (userp) =>
        await this.userPatrolsModel.create(userp)
      )
    )
    await Promise.all(
      createAtendidoDto.userpatrol?.map((patrol)=>{
        this.patrolsModel.findByIdAndUpdate(patrol.patrols, {status:'inactive'})
      })
    )
     
    return await this.atendidosModel.create({
      ...createAtendidoDto,
      userpatrol: userPatrolsIds.map((userp) => userp._id.toString())
    });
  }


  async findAll(filters: FiltersAtendidoDto) {
    const { field = '', skip = 0, limit = 10 } = filters
    const query = {

    }
    return await this.atendidosModel.find(query)
      .populate([
        {
          path: 'complaint',
          model: 'ComplaintsClient',
          select: '-__v',
          populate: [
            {
              path: 'complaint',
              model: 'ComplaintsClient',
              select: '-__v',
            }
          ]
        }
      ])
      .skip(skip)
      .limit(limit)
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} atendido`;
  }

  update(id: number, updateAtendidoDto: UpdateAtendidoDto) {
    return `This action updates a #${id} atendido`;
  }

  remove(id: number) {
    return `This action removes a #${id} atendido`;
  }

  async Patrols(filters: FiltersAtendidoDto) {
    const { field = '', skip = 0, limit = 10 } = filters;

    const matchedMarkers = await this.markerModel.find({ name: { $regex: field, $options: 'i' } }).select('_id');
    const matchedTypes = await this.typeModel.find({ name: { $regex: field, $options: 'i' } }).select('_id');
    const query: any = {
      $or: [
        { plaque: { $regex: field, $options: 'i' } },
        { code: { $regex: field, $options: 'i' } },
        { marker: { $in: matchedMarkers.map(r => r._id) } },
        { type: { $in: matchedTypes.map(r => r._id) } },
        { status: 'active' }
      ],
    };
    const result = await this.patrolsModel.find(query).populate('marker type').skip(skip).limit(limit).exec();
    const total = await this.patrolsModel.countDocuments(query).exec();
    return { result, total };
  }

  async findCurrentShiftsWithActiveUsers() {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const currentTime = now.toTimeString().slice(0, 5)

    const shifts = await this.shitsModel.find({ date: today })
      .populate({
        path: 'grade'
      })
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
              path: 'services',
              model: 'Services',
              select: '-__v',
            },
            {
              path: 'zone',
              model: 'Zone',
              select: '-__v',
            },
            {
              path: 'users',
              model: 'UserShift',
              select: '-__v',
              match: { status: 'active' },
              populate: {
                path: 'user',
                model: 'Users',
                select: '-password -__v',
                populate: [
                  {
                    path: 'grade',
                    model: 'Grade',
                    select: '-__v',
                  },
                  {
                    path: 'post',
                    model: 'Post',
                    select: '-__v',
                  },
                ]
              }
            }]
        }
      })
      .exec()

    const filteredShifts = shifts.map(shift => {
      const validHourRanges = shift.hrs.filter(hr => {
        if (!hr.hrs_i || !hr.hrs_s) return false
        return hr.hrs_i <= currentTime && currentTime <= hr.hrs_s
      })

      return {
        _id: shift._id,
        date: shift.date,
        supervisor: shift.supervisor,
        grade: shift.grade,
        hrs: validHourRanges
      }
    })

    return filteredShifts
  }

}
