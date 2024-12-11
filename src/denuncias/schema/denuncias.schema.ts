import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type DenunciasDocument = HydratedDocument<Denuncias>

@Schema()
export class Denuncias{
    
    @Prop()
    name:string
    @Prop()
    denuncias:[]
}

export const DenunciasSchema = SchemaFactory.createForClass(Denuncias);