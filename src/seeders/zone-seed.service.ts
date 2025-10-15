import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Zone, ZoneDocument } from "src/shits/schema/zone.schema";

const zones: Zone[] = [
    { name:'ZONA ALTA N-2' },
    { name:'ZONA CENTRAL A-2 RP-30' },
    { name:'ZONA BAJA C-1' },
    { name:'PERSONAL DE SERVICIO CÁMARAS' },
    { name:'ZONA ALTA C-2' },
    { name:'ZONA CENTRAL A-3 RP-30' },
    { name:'ZONA BAJA C-4' },

]

Injectable()
export class ZoneSeedService {
    constructor(@InjectModel(Zone.name) private readonly zoneModel:Model<ZoneDocument>){}
    
    async seed(){
                try {
            console.log('Running seed...');

            const count = await this.zoneModel.countDocuments();
            if (count === 0) {
                await Promise.all(
                    zones.map((zone) =>
                        this.zoneModel.create(zone),
                    ),
                );
                console.log('Seed complete zones ✅');
            } else {
                console.log('zones already exist. Seed skipped.');
            }
        } catch (error) {
            console.error('Seed error:', error);
        }
    }
}