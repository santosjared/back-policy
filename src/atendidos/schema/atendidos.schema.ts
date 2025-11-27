import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { ComplaintsClient } from "src/clients/complaints/schema/complaints.schema";
import { UserPatrols } from "./user-patrols.schema";
import { Confirmed } from "src/confirmed/schema/confirmed.schema";

export type AtendidosDocument = HydratedDocument<Atendidos>

@Schema({timestamps:true})
export class Atendidos {
    
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'ComplaintsClient'})
    complaint:ComplaintsClient
    @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'UserPatrols'}]})
    userpatrol:UserPatrols[]
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Confirmed'})
    confirmed:Confirmed
    @Prop({type:String, default:'error'})
    status:string
    @Prop()
    description:string
}

export const AtendidosSchema = SchemaFactory.createForClass(Atendidos);