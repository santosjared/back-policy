import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ShitsDocument = HydratedDocument<Shits>

@Schema({ timestamps: true })
export class Shits {
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Users'})
    supervisor: string
    @Prop()
    date: string
    @Prop()
    hrs: HourRange[]
}

class HourRange {
    @Prop()
    name: string
    @Prop()
    hrs_i: string
    @Prop()
    hrs_s: string
}

export const ShitSchema = SchemaFactory.createForClass(Shits);