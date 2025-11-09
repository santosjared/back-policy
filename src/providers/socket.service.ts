import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ComplaintsClient, ComplaintsClientDocument } from "src/clients/complaints/schema/complaints.schema";
import { TypeComplaint, TypeComplaintsDocument } from "src/complaints/schema/type-complaints.schema";


@Injectable()
export class SocketService {
    constructor(@InjectModel(ComplaintsClient.name) private readonly complaintModel:Model<ComplaintsClientDocument>,
 ){}

    async findComplaint() {
  const [
    waitingComplaints,
    allComplaints,
    denunciasData,
    counts
  ] = await Promise.all([
    this.complaintModel.find({ status: 'waiting' })
      .populate('complaints', 'name')
      .populate('userId', 'name lastName email'),
    this.complaintModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('complaints', 'name')
      .populate('userId', 'name lastName email'),

    this.complaintModel.aggregate([
      {
        $group: {
          _id: '$complaints', 
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'typecomplaints',
          localField: '_id',
          foreignField: '_id',
          as: 'typeInfo',
        },
      },
      { $unwind: '$typeInfo' },
      {
        $project: {
          _id: 0,
          name: '$typeInfo.name',
          total: 1,
        },
      },
    ]),

    this.complaintModel.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
        },
      },
    ]),
  ]);

  const countsMap = counts.reduce((acc, cur) => {
    acc[cur._id] = cur.total;
    return acc;
  }, {} as Record<string, number>);

  const total_denuncias = [
    {
      name: 'Recibidos',
      total: (countsMap.waiting ?? 0) + (countsMap.refused ?? 0) + (countsMap.acepted ?? 0),
    },
    { name: 'Rechazados', total: countsMap.refused ?? 0 },
    { name: 'En espera', total: countsMap.waiting ?? 0 },
    { name: 'Atendidos', total: countsMap.acepted ?? 0 },
  ];

  return {
    waitingComplaints,
    allComplaints,
    denuncias: denunciasData,
    total_denuncias,
  };
}

}