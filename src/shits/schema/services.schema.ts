import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type ServicesDocument = HydratedDocument<Services>

@Schema()
export class Services {
    @Prop()
    name: string
}

export const ServicesSchema = SchemaFactory.createForClass(Services)