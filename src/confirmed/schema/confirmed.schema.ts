import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { TypeComplaint } from "src/complaints/schema/type-complaints.schema";
import { Users } from "src/users/schema/users.schema";
import { Infractor } from "./infractor.schema";

export type ConfirmedDocument = HydratedDocument<Confirmed>

@Schema()
export class Confirmed {
    @Prop()
    sigla:string
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Users'})
    encargado:Users
    @Prop()
    fecha_hecho:string
    @Prop()
    hora_hecho:string
    @Prop()
    lugar_hecho:string
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'TypeComplaint'})
    tipo_denuncia:TypeComplaint
    @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'Infractor'}]})
    infractores:Infractor[]
    @Prop()
    description:string
}

export const ConfirmedSchema = SchemaFactory.createForClass(Confirmed);