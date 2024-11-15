import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ContryDocument = HydratedDocument<Contry>

@Schema()
export class Contry{

    @Prop()
    name:string
}

export const ContrySchema = SchemaFactory.createForClass(Contry)