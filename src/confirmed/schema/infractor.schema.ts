import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type infractorDocument = HydratedDocument<Infractor>

@Schema()
export class Infractor {
    @Prop()
    apellido_paterno:string
    @Prop()
    apellido_materno:string
    @Prop()
    nombres:string
    @Prop()
    ci:string
    @Prop()
    edad:number
    @Prop()
    ocupation:string
    @Prop()
    alias:string
}
export const InfractorSchema = SchemaFactory.createForClass(Infractor);