import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { HourRange } from "./hour-rage.schema";
import { Grade } from "src/users/schema/grade.schema";

export type ShitsDocument = HydratedDocument<Shits>

@Schema({timestamps:true})
export class Shits {

    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Grade'})
    grade:Grade

    @Prop()
    supervisor: string

    @Prop()
    date: string
    
    @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'HourRange'}]})
    hrs: HourRange[]
}

export const ShitSchema = SchemaFactory.createForClass(Shits);