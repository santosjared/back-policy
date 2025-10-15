import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ZoneDocument = HydratedDocument<Zone>

@Schema()
export class Zone {
    @Prop()
    name:string
}

export const ZoneSChema = SchemaFactory.createForClass(Zone)