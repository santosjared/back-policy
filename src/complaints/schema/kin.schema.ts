import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type KinDocument = HydratedDocument<Kin>

@Schema()
export class Kin {
    @Prop()
    name:string
}

export const KinSchema = SchemaFactory.createForClass(Kin);