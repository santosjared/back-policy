import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Services, ServicesDocument } from "src/shits/schema/services.schema";

const services: Services[] = [
    { name:'VEHÍCULO DE SERVICIO' },
    { name:'DISPOSITIVO' },
    { name:'OFICINAS' },
    { name:'SERVICIO INTERNO' },

]

Injectable()
export class ServicesSeedService {
    constructor(@InjectModel(Services.name) private readonly ServicesModel:Model<ServicesDocument>){}
    
    async seed(){
                try {
            console.log('Running seed services...');

            const count = await this.ServicesModel.countDocuments();
            if (count === 0) {
                await Promise.all(
                    services.map((service) =>
                        this.ServicesModel.create(service),
                    ),
                );
                console.log('Seed complete Services ✅');
            } else {
                console.log('Services already exist. Seed skipped.');
            }
        } catch (error) {
            console.error('Seed error services:', error);
        }
    }
}