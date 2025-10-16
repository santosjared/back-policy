import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ComplaintsClient, ComplaintsClientDocument } from './schema/complaints.schema';
import { isValidObjectId, Model } from 'mongoose';
import { ComplaintsClientDto } from './dto/create-complaints.dto';
import { Client, ClientDocumnet } from '../schema/clients.schema';
import { TypeComplaint, TypeComplaintsDocument } from 'src/complaints/schema/type-complaints.schema';
import { FiltersComplaintsDto } from './dto/filters-complaints.dto';
import { Kin, KinDocument } from 'src/complaints/schema/kin.schema';


@Injectable()
export class ComplaintsClientService {
  constructor(@InjectModel(ComplaintsClient.name) private readonly complaintsService: Model<ComplaintsClientDocument>,
    @InjectModel(Client.name) private readonly userService: Model<ClientDocumnet>,
    @InjectModel(TypeComplaint.name) private readonly typeComplaintService: Model<TypeComplaintsDocument>,
    @InjectModel(Kin.name) private readonly kinService: Model<KinDocument>,
  ) { }

  async create(complaints: ComplaintsClientDto) {
    try {
      const response = await this.complaintsService.create({
        ...complaints,
        status: 'waiting',
      });

      return await response.populate([
        { path: 'complaints' },
        { path: 'aggressor' },
        { path: 'victim' },
      ]);
    } catch {
      throw new BadRequestException();
    }
  }
  async findAll(filters: FiltersComplaintsDto) {
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
  
    const matchedUser = await this.userService.find({
      $or: [
        { name: { $regex: field, $options: 'i' } },
        { lastName: { $regex: field, $options: 'i' } },
        { email: { $regex: field, $options: 'i' } },
        { phone: { $regex: field, $options: 'i' } },
      ]
    }).select('_id');

    const matchedComplaints = await this.typeComplaintService.find({ name: { $regex: field, $options: 'i' } }).select('_id');
    const matchedKin = await this.kinService.find({ name: { $regex: field, $options: 'i' } }).select('_id');

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

  const total = await this.complaintsService.countDocuments(query).exec();
  const result = await this.complaintsService.find(query)
    .populate('userId complaints aggressor victim')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return { total, result };
}

  async findComplaintsOfUser(userId: string, status: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('userId inválido');
    }

    const query: any = { userId };
    if (status) query.status = status;

    return this.complaintsService.find(query).sort({ createdAt: -1 }).populate([
      { path: 'complaints' },
      { path: 'aggressor' },
      { path: 'victim' },
    ]);
  }

  async findOne(id: string) {
    return await this.complaintsService.findOne({ _id: id })
  }
  async findAllWithStatus(
    status: string,
    skip?: number,
    limit?: number,
    name?: string,
    date?: string
  ) {
    const query: any = {};

    if (status && status.trim() !== '') {
      query.status = status;
    }

    if (name && name.trim() !== '') {
      const userQuery = {
        $or: [
          { name: { $regex: name, $options: 'i' } },
          { lastName: { $regex: name, $options: 'i' } },
          { email: { $regex: name, $options: 'i' } },
          { phone: { $regex: name, $options: 'i' } },
        ]

      }
      const users = await this.userService.find(userQuery);
      if (users && users.length > 0) {
        const userIds = users.map(user => user._id);
        query.userId = { $in: userIds };
      }
      const complaints = await this.typeComplaintService.find({
        $or: [
          { name: { $regex: name, $options: 'i' } }
        ]
      })
      if (complaints && complaints.length > 0) {
        const complaitsIds = complaints.map(complaint => complaint._id)
        query.complaints = { $in: complaitsIds }
      }
    }

    if (date && date.trim() !== '') {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      query.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const [data, total, totalWaiting] = await Promise.all([
      this.complaintsService
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate([
          { path: 'userId' },
          { path: 'complaints' },
          { path: 'aggressor' },
          { path: 'victim' },
        ]),
      this.complaintsService.countDocuments(query),
      this.complaintsService.countDocuments({ status: 'waiting' })
    ]);

    return { data, total, totalWaiting };
  }

  async refusedComplaint(_id: string) {
    return await this.complaintsService.findByIdAndUpdate(_id, { status: 'refused' })
  }
}