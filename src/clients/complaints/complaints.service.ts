import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ComplaintsClient, ComplaintsClientDocument } from './schema/complaints.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { ComplaintsClientDto } from './dto/create-complaints.dto';
import { Client, ClientDocument } from '../schema/clients.schema';
import { TypeComplaint, TypeComplaintsDocument } from 'src/complaints/schema/type-complaints.schema';
import { FiltersComplaintsDto } from './dto/filters-complaints.dto';
import { Kin, KinDocument } from 'src/complaints/schema/kin.schema';
import { EmergencyComplaintDto } from './dto/emergency-complaints.dto';


@Injectable()
export class ComplaintsClientService {
  constructor(@InjectModel(ComplaintsClient.name) private readonly complaintsService: Model<ComplaintsClientDocument>,
    @InjectModel(Client.name) private readonly userService: Model<ClientDocument>,
    @InjectModel(TypeComplaint.name) private readonly typeComplaintService: Model<TypeComplaintsDocument>,
    @InjectModel(Kin.name) private readonly kinService: Model<KinDocument>,
  ) { }

  async create(complaints: ComplaintsClientDto) {
    try {
      if (!complaints.complaints || !Types.ObjectId.isValid(complaints.complaints)) {
        delete complaints.complaints;
      }
      if (!complaints.aggressor || !Types.ObjectId.isValid(complaints.aggressor)) {
        delete complaints.aggressor;
      }
      if (!complaints.victim || !Types.ObjectId.isValid(complaints.victim)) {
        delete complaints.victim;
      }
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
    return await this.complaintsService.findById(id)
      .populate('userId complaints aggressor victim')
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
  
  async Emergency(emergencyDto: EmergencyComplaintDto) {

    if (!emergencyDto.userId || !Types.ObjectId.isValid(emergencyDto.userId)) {
      delete emergencyDto.userId;
    }

    let findComplaint = await this.typeComplaintService.findOne({ name: 'Emergencia' });
    if (!findComplaint) {
      findComplaint = await this.typeComplaintService.create({ name: 'Emergencia' });
    }

    return await this.complaintsService.create({
      ...emergencyDto,
      complaints: findComplaint._id.toString(),
      status: 'waiting',
    });
  }
}