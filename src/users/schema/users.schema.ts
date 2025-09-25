import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Rol } from 'src/roles/schema/roles.schema';

export type UsersDocument = HydratedDocument<Users>

@Schema()
export class Users {
    @Prop()
    lastName: string
    @Prop({unique:true})
    email: string
    @Prop()
    phone: string
    @Prop()
    password: string
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Rol'})
    rol:Rol
    @Prop()
    grade: string
    @Prop()
    paternalSurname: string
    @Prop()
    maternalSurname: string
    @Prop()
    firstName: string
    @Prop()
    exp: string
    @Prop()
    post: string
    @Prop()
    ci:string
    @Prop()
    gender:string
    @Prop()
    address:string
    @Prop({type:String, default:'activo'})
    status:string
}

export const UsersSchema = SchemaFactory.createForClass(Users)