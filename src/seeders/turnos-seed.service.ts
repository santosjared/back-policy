import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Turnos, TurnosDocument } from "src/shits/schema/turnos.schema";

const turnos: Turnos[] = [
    { name:'TURNO MAÑANA' },
    { name:'TURNO TARDE' },
    { name:'TURNO NOCHE' },
]

Injectable()
export class TurnosSeedService {
    constructor(@InjectModel(Turnos.name) private readonly turnosModel:Model<TurnosDocument>){}
    
    async seed(){
                try {
            console.log('Running seed turnos...');

            const count = await this.turnosModel.countDocuments();
            if (count === 0) {
                await Promise.all(
                    turnos.map((turno) =>
                        this.turnosModel.create(turno),
                    ),
                );
                console.log('Seed complete turnos ✅');
            } else {
                console.log('turnos already exist. Seed skipped.');
            }
        } catch (error) {
            console.error('Seed error turnos:', error);
        }
    }
}