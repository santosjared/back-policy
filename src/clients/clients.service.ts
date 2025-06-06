import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocumnet } from './schema/clients.schema';
import { Model } from 'mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import * as bcrypt from 'bcrypt';
import { Rol, RolDocument } from 'src/roles/schema/roles.schema';
import { Roles } from 'src/constants/roles.constants';
import { UpdateClienteDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(@InjectModel(Client.name) private readonly ClientSercice:Model<ClientDocumnet>,
    @InjectModel(Rol.name)private readonly rolService:Model<RolDocument>
){}
    
    async create(createClientDto:CreateClientDto){
        try{
            const password = await bcrypt.hash(createClientDto.password,10)
            const rol = await this.rolService.findOne({name:Roles.CLIENT})
            return await this.ClientSercice.create({...createClientDto, password, rol:rol._id, provider:'local'})
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
