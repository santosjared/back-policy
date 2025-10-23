import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Marker } from "./marker.schema";
import { Type } from "./type.schema";

export type PatrolsDocument = HydratedDocument<Patrols>

@Schema()
export class Patrols {
    @Prop()
    plaque:string
    @Prop()
    code:string
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Marker'})
    marker:Marker
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Type'})
    type:Type
    @Prop()
    imageUrl:string
    @Prop({type:String, default:'active'})
    status:string
}

export const PatrolsSchema = SchemaFactory.createForClass(Patrols);