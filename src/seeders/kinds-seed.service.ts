import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Kin, KinDocument } from "src/complaints/schema/kin.schema";

const kinds: Kin[] = [
    { name:'Padre' },
    { name:'Madre' },
    { name:'Hijo' },
    { name:'Hija' },
    { name:'Hermano' },
    { name:'Hermana' },
    { name:'Abuelo' },
    { name:'Abuela' },
    { name:'Nieto' },
    { name:'Nieta' },
    { name:'Tío' },
    { name:'Tía' },
    { name:'Sobrino' },
    { name:'Sobrina' },
    { name:'Primo' },
    { name:'Prima' },
    { name:'Padrastro' },
    { name:'Madrastra' },
    { name:'Hijastro' },
    { name:'Hijastra' },
    { name:'Cuñado' },
    { name:'Cuñada' },
    { name:'Suegro' },
    { name:'Suegra' },
    { name:'Yerno' },
    { name:'Yerna' },

]

Injectable()
export class KindsSeedService {
    constructor(@InjectModel(Kin.name) private readonly kindModel:Model<KinDocument>){}
    
    async seed(){
                try {
            console.log('Running seed kinds...');

            const count = await this.kindModel.countDocuments();
            if (count === 0) {
                await Promise.all(
                    kinds.map((kin) =>
                        this.kindModel.create(kin),
                    ),
                );
                console.log('Seed complete kinds ✅');
            } else {
                console.log('kinds already exist. Seed skipped.');
            }
        } catch (error) {
            console.error('Seed error kinds:', error);
        }
    }
}