import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ComplaintsClient, ComplaintsClientDocument } from './schema/complaints.schema';
import { isValidObjectId, Model } from 'mongoose';
import { ComplaintsClientDto } from './dto/create-complaints.dto';


@Injectable()
export class ComplaintsClientService{
    constructor(@InjectModel(ComplaintsClient.name)private readonly complaintsService:Model<ComplaintsClientDocument>){}

    async create(complaints:ComplaintsClientDto){
        try{
            const response = await this.complaintsService.create({
                ...complaints,
                status: 'waiting',
              });
              
              return await response.populate([
                { path: 'complaints' },
                { path: 'aggressor' },
                { path: 'victim' },
              ]);
        }catch{
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

    async findOne(id:string){
        return await this.complaintsService.findOne({_id:id})
    }
}