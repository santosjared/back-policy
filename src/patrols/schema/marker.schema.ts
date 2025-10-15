import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type MarkerDocument = HydratedDocument<Marker>

@Schema()
export class Marker {
    @Prop()
    name:string
}

export const MarkerSchema = SchemaFactory.createForClass(Marker);