import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Atendidos, AtendidosDocument } from "src/atendidos/schema/atendidos.schema";
import { ComplaintsClient, ComplaintsClientDocument } from "src/clients/complaints/schema/complaints.schema";
import { Client, ClientDocument } from "src/clients/schema/clients.schema";
import { Kin, KinDocument } from "src/complaints/schema/kin.schema";
import { TypeComplaint, TypeComplaintsDocument } from "src/complaints/schema/type-complaints.schema";
import { UserShift, UserShiftDocument } from "src/shits/schema/user-shift.schema";
import { FiltersAsignadosDto } from "./dto/filters-asignados.dto";
import { Patrols } from "src/patrols/schema/patrols.schema";
import { Shits, ShitsDocument } from "src/shits/schema/shits.schema";

export type AtendidosDocumento = Atendidos & Document & {
    createdAt: Date;
    updatedAt: Date;
};

@Injectable()
export class AsignadosService {
    constructor(@InjectModel(Atendidos.name) private readonly atendidosModel: Model<AtendidosDocument>,
        @InjectModel(ComplaintsClient.name) private readonly complaintsClienttModel: Model<ComplaintsClientDocument>,
        @InjectModel(Client.name) private readonly userModel: Model<ClientDocument>,
        @InjectModel(TypeComplaint.name) private readonly typeComplaintModel: Model<TypeComplaintsDocument>,
        @InjectModel(Kin.name) private readonly kinModel: Model<KinDocument>,
        @InjectModel(Patrols.name) private readonly patrolsModel: Model<Patrols>,
        @InjectModel(UserShift.name) private readonly usershiftModel: Model<UserShiftDocument>,
        @InjectModel(Shits.name) private readonly shiftModel: Model<ShitsDocument>
    ) { }

    async findAll(filters: FiltersAsignadosDto) {

        const { field = '', skip = 0, limit = 10 } = filters;
        const query: any = {};
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
                        populate: [
                            { path: 'encargado', select: '-__v' },
                            { path: 'tipo_denuncia', select: '-__v' },
                            { path: 'infractores', select: '-__v' },
                        ]
                    }
                ])
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const total = await this.atendidosModel.countDocuments(query);
            return { result, total };
        }

        const isDate = /^\d{4}-\d{2}-\d{2}$/.test(field);
        if (isDate) {
            const startDate = new Date(field);
            const endDate = new Date(field);
            endDate.setDate(endDate.getDate() + 1);

            query.createdAt = { $gte: startDate, $lt: endDate };
        } else {
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
                    populate: [
                        { path: 'encargado', select: '-__v' },
                        { path: 'tipo_denuncia', select: '-__v' },
                        { path: 'infractores', select: '-__v' },
                    ]
                }
            ])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.atendidosModel.countDocuments(query);
        return { result, total };
    }

    async update(id: string) {
        const atendidos = await this.atendidosModel
            .findById(id)
            .populate({
                path: 'userpatrol',
                populate: [
                    { path: 'patrols' },
                    { path: 'user' }
                ]
            });

        if (!atendidos) {
            throw new NotFoundException('Denuncia no encontrada');
        }

        if (!atendidos.userpatrol || atendidos.userpatrol.length === 0) {
            return await this.atendidosModel.findByIdAndUpdate(id, { status: 'success' });
        }

        await Promise.all(
            atendidos.userpatrol.map(async (userp: any) => {
                if (userp.patrols?._id) {
                    await this.patrolsModel.findByIdAndUpdate(userp.patrols._id, { status: 'active' });
                }

                if (Array.isArray(userp.user)) {
                    await Promise.all(
                        userp.user.map(async (usr: any) => {
                            const userId = usr._id ?? usr;
                            await this.usershiftModel.findByIdAndUpdate(userId, { status: 'active' });
                        })
                    );
                }
            })
        );

        return await this.atendidosModel.findByIdAndUpdate(
            id,
            { status: 'success' },
            { new: true }
        );
    }

    async generarPdF(date: string) {

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        const [turnoRaw, atendidosRaw] = await Promise.all([
            this.shiftModel.findOne({ date }).populate('hrs'),
            this.atendidosModel.find({
                status: 'success',
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }).populate({
                path: 'confirmed',
                populate: { path: 'tipo_denuncia' }
            })
        ]);

        const turno = turnoRaw;
       const atendidos = atendidosRaw as  any[];

        const result = turno?.hrs?.map?.(hr => ({
            turno: hr.name,
            desde: hr.hrs_i,
            hasta: hr.hrs_s,
            denuncias: {}
        }));

        for (const a of atendidos) {
            const hora = a.createdAt.toTimeString().substring(0, 5);

            const turnoMatch = turno.hrs.find(t =>
                hora >= t.hrs_i && hora <= t.hrs_s
            );

            if (!turnoMatch) continue;

            const tipo = a.confirmed?.tipo_denuncia?.name || "sin_tipo";

            const index = result.findIndex(r => r.turno === turnoMatch.name);

            if (!result[index].denuncias[tipo]) {
                result[index].denuncias[tipo] = 0;
            }

            result[index].denuncias[tipo]++;
        }

        return result;

    }

}