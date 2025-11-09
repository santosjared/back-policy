import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocument } from './schema/clients.schema';
import { Model } from 'mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import * as bcrypt from 'bcrypt';
import { UpdateClienteDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(@InjectModel(Client.name) private readonly ClientSercice:Model<ClientDocument>,
){}
    
    async create(createClientDto:CreateClientDto){
        try{
            const password = await bcrypt.hash(createClientDto.password,10)
            return await this.ClientSercice.create({...createClientDto, password, provider:'local'})
        }catch(e){
            console.log('Error al crear cliente: ',e)
            throw new HttpException('Interval Server', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async checkEmail(email:string){
        return await this.ClientSercice.findOne({email}) !==null;
    }
    async findOne(email:string){
        const user = await this.ClientSercice.findOne({email})
        if(user) return user
        throw new NotFoundException('user not found')
    }
    async update(id:string, updateCliente:UpdateClienteDto){
        const result = await this.ClientSercice.findOneAndUpdate({_id:id},updateCliente)
        return result
    }
}
