import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocument } from './schema/clients.schema';
import { Model } from 'mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import * as bcrypt from 'bcrypt';
import { UpdateClienteDto } from './dto/update-client.dto';
import { Auth, AuthDocument } from 'src/auth/schema/auth.schema';

@Injectable()
export class ClientsService {
    constructor(@InjectModel(Client.name) private readonly ClientSercice: Model<ClientDocument>,
        @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    ) { }

    async create(createClientDto: CreateClientDto) {
        try {
            if (createClientDto.email && createClientDto.password) {
                const password = await bcrypt.hash(createClientDto.password, 10);
                await this.authModel.create({ email: createClientDto.email, password });
            }
            return await this.ClientSercice.create({ ...createClientDto, provider: 'local' })
        } catch (e) {
            console.log('Error al crear cliente: ', e)
            throw new HttpException('Interval Server', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async checkEmail(email: string) {
        return await this.ClientSercice.findOne({ email }) !== null;
    }
    async findOne(email: string) {
        const user = await this.ClientSercice.findOne({ email })
        if (user) return user
        throw new NotFoundException('user not found')
    }
    async update(id: string, updateCliente: UpdateClienteDto) {
        const user = await this.ClientSercice.findById(id);

        if (!user) {
            throw new NotFoundException('user not found');
        }
        if (updateCliente.email && updateCliente.email !== user.email) {
            await this.authModel.findOneAndUpdate(
                { email: user.email },
                { $set: { email: updateCliente.email } },
                { new: true }
            );
        }

        const result = await this.ClientSercice.findOneAndUpdate(
            { _id: id },
            updateCliente,
            { new: true }
        );

        return result;
    }

}
