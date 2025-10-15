import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UserServices } from "./user-services.schema";

export type HourRangeDocument = HydratedDocument<HourRange>

@Schema()
export class HourRange {
    @Prop()
    name: string
    @Prop()
    hrs_i: string
    @Prop()
    hrs_s: string
    @Prop({type:[{ type: mongoose.SchemaTypes.ObjectId, ref: 'UserServices' }]})
    services: UserServices[]
}

export const HourRangeSchema = SchemaFactory.createForClass(HourRange);