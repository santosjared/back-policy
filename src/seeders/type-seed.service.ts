import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Type, TypeDocument } from "src/patrols/schema/type.schema";

const types: Type[] = [
    { name:'Moto' },
    { name:'Camioneta' },
    { name:'Vagoneta' },
]

Injectable()
export class TypeSeedService {
    constructor(@InjectModel(Type.name) private readonly TypeModel:Model<TypeDocument>){}
    
    async seed(){
                try {
            console.log('Running seed...');
                    
            const count = await this.TypeModel.countDocuments();
            if (count === 0) {
                await Promise.all(
                    types.map((type) =>
                        this.TypeModel.create(type),
                    ),
                );
                console.log('Seed complete Types ✅');
            } else {
                console.log('Types already exist. Seed skipped.');
            }
        } catch (error) {
            console.error('Seed error:', error);
        }
    }
}