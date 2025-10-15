import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { HourRange } from "./hour-rage.schema";

export type ShitsDocument = HydratedDocument<Shits>

@Schema({timestamps:true})
export class Shits {
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Users'})
    supervisor: string
    @Prop()
    date: string
    @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'HourRange'}]})
    hrs: HourRange[]
}

export const ShitSchema = SchemaFactory.createForClass(Shits);