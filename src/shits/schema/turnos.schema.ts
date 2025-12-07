import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type TurnosDocument = HydratedDocument<Turnos>

@Schema()
export class Turnos {
    @Prop()
    name:string
}

export const TurnosSchema = SchemaFactory.createForClass(Turnos);