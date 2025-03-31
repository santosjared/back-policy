import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rol, RolDocument } from './schema/roles.schema';
import { Model } from 'mongoose';
import { CreateRolDto } from './dto/create-roles.dto';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Rol.name)private readonly rolService:Model<RolDocument>){}
    
    async create(createRolDto:CreateRolDto){
        try{
            return await this.rolService.create(createRolDto)
        }catch(e){
            console.log('error al crear rol',e);
            throw new HttpException('interval server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
