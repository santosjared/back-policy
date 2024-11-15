import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Gender } from './gender.schema';
import { Contry } from './contry.schema';

export type UsersDocument = HydratedDocument<Users>

@Schema()
export class Users{

    @Prop()
    name:string
    @Prop()
    lastName:string
    @Prop()
    ci:string
    @Prop()
    email:string
    @Prop()
    password:string
    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'Gender'})
    gender:Gender
    @Prop()
    phone:string
    @Prop({required:true})
    address:string
    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'Contry'})
    contry:Contry
    @Prop()
    profile:string
}

export const UsersSchema = SchemaFactory.createForClass(Users)