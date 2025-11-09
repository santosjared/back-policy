import { Injectable } from '@nestjs/common';
import { CreateAtendidoDto } from './dto/create-atendido.dto';
import { UpdateAtendidoDto } from './dto/update-atendido.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Atendidos, AtendidosDocument } from './schema/atendidos.schema';
import { Model } from 'mongoose';
import { UserPatrols, UserPatrolsDocument } from './schema/user-patrols.schema';
import { FiltersAtendidosDto } from './dto/filters-atendido.dto';
import { Patrols, PatrolsDocument } from 'src/patrols/schema/patrols.schema';
import { Marker, MarkerDocument } from 'src/patrols/schema/marker.schema';
import { Type, TypeDocument } from 'src/patrols/schema/type.schema';
import { Shits, ShitsDocument } from 'src/shits/schema/shits.schema';
import { UserShift, UserShiftDocument } from 'src/shits/schema/user-shift.schema';
import { ComplaintsClient, ComplaintsClientDocument } from 'src/clients/complaints/schema/complaints.schema';
import { Client, ClientDocument } from 'src/clients/schema/clients.schema';
import { TypeComplaint, TypeComplaintsDocument } from 'src/complaints/schema/type-complaints.schema';
import { Kin, KinDocument } from 'src/complaints/schema/kin.schema';

@Injectable()
export class AtendidosService {
  constructor(@InjectModel(Atendidos.name) private readonly atendidosModel: Model<AtendidosDocument>,
    @InjectModel(UserPatrols.name) private readonly userPatrolsModel: Model<UserPatrolsDocument>,
    @InjectModel(Patrols.name) private readonly patrolsModel: Model<PatrolsDocument>,
    @InjectModel(Marker.name) private readonly markerModel: Model<MarkerDocument>,
    @InjectModel(Type.name) private readonly typeModel: Model<TypeDocument>,
    @InjectModel(Shits.name) private readonly shitsModel: Model<ShitsDocument>,
    @InjectModel(UserShift.name) private readonly userShiftModel: Model<UserShiftDocument>,
    @InjectModel(ComplaintsClient.name) private readonly complaintsClientModel: Model<ComplaintsClientDocument>,
    @InjectModel(Client.name) private readonly userModel: Model<ClientDocument>,
    @InjectModel(Kin.name) private readonly kinModel: Model<KinDocument>,
  ) { }
  async create(createAtendidoDto: CreateAtendidoDto) {
    const userPatrols = await Promise.all(
      createAtendidoDto.userpatrol.map((userp) =>
        this.userPatrolsModel.create(userp)
      )
    );

    await Promise.all(
      createAtendidoDto.userpatrol.map(async (patrol) => {
        await this.patrolsModel.findByIdAndUpdate(patrol.patrols, { status: 'inactive' });
        await Promise.all(
          patrol.user.map((userId) =>
            this.userShiftModel.findByIdAndUpdate(userId, { status: 'inactive' })
          )
        );
      })
    );
    await this.complaintsClientModel.findByIdAndUpdate(createAtendidoDto.complaint, { status: 'acepted' })
    return this.atendidosModel.create({
      ...createAtendidoDto,
      userpatrol: userPatrols.map((userp) => userp._id.toString()),
    });
  }

  async findAll(filters: FiltersAtendidosDto) {
    const { field = '', status = '', skip = 0, limit = 10 } = filters;

    const query: any = {};

    const isDate = /^\d{4}-\d{2}-\d{2}$/.test(field);
    if (isDate) {
      const startDate = new Date(field);
      const endDate = new Date(field);
      endDate.setDate(endDate.getDate() + 1);

      query.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
    } else {

      const matchedUser = await this.userModel.find({
        $or: [
          { name: { $regex: field, $options: 'i' } },
          { lastName: { $regex: field, $options: 'i' } },
          { email: { $regex: field, $options: 'i' } },
          { phone: { $regex: field, $options: 'i' } },
        ]
      }).select('_id');

      const matchedComplaints = await this.typeModel.find({ name: { $regex: field, $options: 'i' } }).select('_id');
      const matchedKin = await this.kinModel.find({ name: { $regex: field, $options: 'i' } }).select('_id');

      query.$or = [
        { place: { $regex: field, $options: 'i' } },
        { otherComplaints: { $regex: field, $options: 'i' } },
        { otherAggressor: { $regex: field, $options: 'i' } },
        { otherVictim: { $regex: field, $options: 'i' } },
        { userId: { $in: matchedUser.map(r => r._id) } },
        { complaints: { $in: matchedComplaints.map(r => r._id) } },
        { aggressor: { $in: matchedKin.map(r => r._id) } },
        { victim: { $in: matchedKin.map(r => r._id) } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const total = await this.complaintsClientModel.countDocuments(query).exec();
    const result = await this.complaintsClientModel.find(query)
      .populate('userId complaints aggressor victim')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return { total, result };
  }

  async Patrols(filters: FiltersAtendidosDto) {
    const { field = '', skip = 0, limit = 10 } = filters;
    let query: any = { status: 'active' }
    if (field) {

      const regex = new RegExp(field, 'i');

      const [matchedMarkers, matchedTypes] = await Promise.all([
        this.markerModel.find({ name: regex }).select('_id'),
        this.typeModel.find({ name: regex }).select('_id'),
      ]);
      const orFilters: any[] = [
        { plaque: regex },
        { code: regex },
        { marker: { $in: matchedMarkers.map(r => r._id) } },
        { type: { $in: matchedTypes.map(r => r._id) } },
      ];
      query = { ...query, $or: orFilters };
    }
    const safeLimit = Math.min(limit, 100);
    const [result, total] = await Promise.all([
      this.patrolsModel.find(query)
        .populate('marker type')
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      this.patrolsModel.countDocuments(query).exec(),
    ]);

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
            { path: 'services', model: 'Services', select: '-__v' },
            { path: 'zone', model: 'Zone', select: '-__v' },
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
                  { path: 'grade', model: 'Grade', select: '-__v' },
                  { path: 'post', model: 'Post', select: '-__v' }
                ]
              }
            }
          ]
        }
      })
      .exec()

    const filteredShifts = shifts
      .map(shift => {
        const validHourRanges = shift.hrs.filter(hr => {
          if (!hr.hrs_i || !hr.hrs_s) return false
          return hr.hrs_i <= currentTime && currentTime <= hr.hrs_s
        })
        return validHourRanges.length > 0 ? { ...shift.toObject(), hrs: validHourRanges } : null
      })
      .filter((shift): shift is NonNullable<typeof shift> => shift !== null)

    return filteredShifts
  }

  async refusedComplaint(_id: string) {
    return await this.complaintsClientModel.findByIdAndUpdate(_id, { status: 'refused' })
  }


}
