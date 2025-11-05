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
import { UserShift, UserShiftDocument } from 'src/shits/schema/user-shift.schema';
import { ComplaintsClient, ComplaintsClientDocument } from 'src/clients/complaints/schema/complaints.schema';
import { Client, ClientDocumnet } from 'src/clients/schema/clients.schema';
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
    @InjectModel(ComplaintsClient.name) private readonly complaintsClienttModel: Model<ComplaintsClientDocument>,
    @InjectModel(Client.name) private readonly userModel: Model<ClientDocumnet>,
    @InjectModel(TypeComplaint.name) private readonly typeComplaintModel: Model<TypeComplaintsDocument>,
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
    await this.complaintsClienttModel.findByIdAndUpdate(createAtendidoDto.complaint, { status: 'acepted' })
    return this.atendidosModel.create({
      ...createAtendidoDto,
      userpatrol: userPatrols.map((userp) => userp._id.toString()),
    });
  }

  async findAll(filters: FiltersAtendidoDto) {
   
    const { field = '', skip = 0, limit = 10 } = filters;

    // Consulta base
    const query: any = {};

    // Si no hay campo de búsqueda, devuelve todo
    if (!field) {
      const result = await this.atendidosModel.find(query)
        .populate([
          {
            path: 'complaint',
            model: 'ComplaintsClient',
            select: '-__v',
            populate: [
              { path: 'userId', model: 'Client', select: '-__v -password' },
              { path: 'aggressor', model: 'Kin', select: '-__v' },
              { path: 'victim', model: 'Kin', select: '-__v' },
              { path: 'complaints', model: 'TypeComplaint', select: '-__v' },
            ],
          },
          {
            path: 'userpatrol',
            model: 'UserPatrols',
            select: '-__v',
            populate: [
              {
                path: 'patrols',
                model: 'Patrols',
                select: '-__v',
                populate: [
                  {
                    path: 'marker',
                    model: 'Marker',
                    select: '-__v',
                  },
                  {
                    path: 'type',
                    model: 'Type',
                    select: '-__v',
                  }
                ]
              },
              {
                path: 'user',
                model: 'UserShift',
                select: '-__v',
                populate: {
                  path: 'user',
                  model: 'Users',
                  select: '-__v -password',
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
                },
              },
            ],
          },
           {
          path: 'confirmed',
          select: '-__v',
          populate:[
            { path: 'encargado', select: '-__v'},
            { path: 'tipo_denuncia', select: '-__v'},
            { path: 'infractores', select: '-__v'},
          ]
        }
        ])
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.atendidosModel.countDocuments(query);
      return { result, total };
    }

    // 🗓 Verificar si el campo es una fecha
    const isDate = /^\d{4}-\d{2}-\d{2}$/.test(field);
    if (isDate) {
      const startDate = new Date(field);
      const endDate = new Date(field);
      endDate.setDate(endDate.getDate() + 1);

      query.createdAt = { $gte: startDate, $lt: endDate };
    } else {
      // 🔍 Buscar coincidencias relacionadas
      const matchedUser = await this.userModel.find({
        $or: [
          { name: { $regex: field, $options: 'i' } },
          { lastName: { $regex: field, $options: 'i' } },
          { email: { $regex: field, $options: 'i' } },
          { phone: { $regex: field, $options: 'i' } },
        ],
      }).select('_id');

      const matchedComplaints = await this.typeComplaintModel.find({
        name: { $regex: field, $options: 'i' },
      }).select('_id');

      const matchedKin = await this.kinModel.find({
        name: { $regex: field, $options: 'i' },
      }).select('_id');

      const complaintsQuery = {
        $or: [
          { place: { $regex: field, $options: 'i' } },
          { otherComplaints: { $regex: field, $options: 'i' } },
          { otherAggressor: { $regex: field, $options: 'i' } },
          { otherVictim: { $regex: field, $options: 'i' } },
          { userId: { $in: matchedUser.map(r => r._id) } },
          { complaints: { $in: matchedComplaints.map(r => r._id) } },
          { aggressor: { $in: matchedKin.map(r => r._id) } },
          { victim: { $in: matchedKin.map(r => r._id) } },
        ],
      };

      const matchedComplaint = await this.complaintsClienttModel
        .find(complaintsQuery)
        .select('_id');

      query.complaint = { $in: matchedComplaint.map(r => r._id) };
      query.status = { $regex: field, $options: 'i' };
    }

    // 📦 Ejecutar búsqueda principal
    const result = await this.atendidosModel.find(query)
      .populate([
        {
          path: 'complaint',
          model: 'ComplaintsClient',
          select: '-__v',
          populate: [
            { path: 'userId', model: 'Client', select: '-__v -password' },
            { path: 'aggressor', model: 'Kin', select: '-__v' },
            { path: 'victim', model: 'Kin', select: '-__v' },
            { path: 'complaints', model: 'TypeComplaint', select: '-__v' },
          ],
        },
        {
          path: 'userpatrol',
          model: 'UserPatrols',
          select: '-__v',
          populate: [
            {
              path: 'patrols',
              model: 'Patrols',
              select: '-__v',
              populate: [
                {
                  path: 'marker',
                  model: 'Marker',
                  select: '-__v',
                },
                {
                  path: 'type',
                  model: 'Type',
                  select: '-__v',
                }
              ]
            },
            {
              path: 'user',
              model: 'UserShift',
              select: '-__v',
              populate: {
                path: 'user',
                model: 'Users',
                select: '-__v -password',
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
              },
            },
          ],
        },
         {
          path: 'confirmed',
          select: '-__v',
          populate:[
            { path: 'encargado', select: '-__v'},
            { path: 'tipo_denuncia', select: '-__v'},
            { path: 'infractores', select: '-__v'},
          ]
        }
      ])
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.atendidosModel.countDocuments(query);
    return { result, total };
  }


  async findOne(userId: string) {

    const shifts = await this.userShiftModel.find({ user: userId }, '_id');
    const shiftIds = shifts.map(s => s._id);

    const patrols = await this.userPatrolsModel.find({ user: { $in: shiftIds } }, '_id');
    const patrolIds = patrols.map(p => p._id);

    const atendido = await this.atendidosModel
      .findOne({
        userpatrol: { $in: patrolIds },
        status: { $ne: 'success' },
      })
      .populate([
        {
          path: 'userpatrol',
          populate: {
            path: 'user',
            populate: { path: 'user', select: '-__v -password' },
          },
        },
        {
          path: 'complaint',
          populate: [
            { path: 'userId' },
            { path: 'complaints' },
            { path: 'aggressor' },
            { path: 'victim' },
          ],
        },
        {
          path: 'confirmed',
          select: '-__v',
          populate:[
            { path: 'encargado', select: '-__v'},
            { path: 'tipo_denuncia', select: '-__v'},
            { path: 'infractores', select: '-__v'},
          ]
        }
      ]);

    return atendido;
  }



  async update(id: string, updateAtendidoDto: UpdateAtendidoDto) {
    return await this.atendidosModel.findByIdAndUpdate(id, { status: 'success' });
  }

  remove(id: number) {
    return `This action removes a #${id} atendido`;
  }

  async Patrols(filters: FiltersAtendidoDto) {
    const { field = '', skip = 0, limit = 10 } = filters;

    const regex = new RegExp(field, 'i');

    const [matchedMarkers, matchedTypes] = await Promise.all([
      this.markerModel.find({ name: regex }).select('_id'),
      this.typeModel.find({ name: regex }).select('_id'),
    ]);

    const query: any = {
      status: 'active',
      $or: [
        { plaque: regex },
        { code: regex },
        { marker: { $in: matchedMarkers.map(r => r._id) } },
        { type: { $in: matchedTypes.map(r => r._id) } },
      ],
    };

    const [result, total] = await Promise.all([
      this.patrolsModel.find(query).populate('marker type').skip(skip).limit(limit).exec(),
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
