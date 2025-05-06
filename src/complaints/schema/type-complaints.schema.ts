import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type TypeComplaintsDocument = HydratedDocument<TypeComplaint>

@Schema()
export class TypeComplaint {
    @Prop()
    name:string
    @Prop()
    image:string
    @Prop()
    description:string
}

export const TypeComplaintSchema = SchemaFactory.createForClass(TypeComplaint);