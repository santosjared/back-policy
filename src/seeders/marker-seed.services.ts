import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Marker, MarkerDocument } from "src/patrols/schema/marker.schema";
import { Type, TypeDocument } from "src/patrols/schema/type.schema";

const markers: Marker[] = [
    { name:'Toyota' },
    { name:'Nissan' },
    { name:'Honda' },
]

Injectable()
export class MarkerSeedService {
    constructor(@InjectModel(Marker.name) private readonly MarkerModel:Model<MarkerDocument>){}
    
    async seed(){
                try {
            console.log('Running seed markers...');
                    
            const count = await this.MarkerModel.countDocuments();
            if (count === 0) {
                await Promise.all(
                    markers.map((marker) =>
                        this.MarkerModel.create(marker),
                    ),
                );
                console.log('Seed complete Markers ✅');
            } else {
                console.log('Markers already exist. Seed skipped.');
            }
        } catch (error) {
            console.error('Seed error markers:', error);
        }
    }
}