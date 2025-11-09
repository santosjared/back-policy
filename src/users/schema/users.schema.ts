import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Rol } from 'src/roles/schema/roles.schema';
import { Grade } from './grade.schema';
import { Post } from './post.schema';

export type UsersDocument = HydratedDocument<Users>

@Schema({timestamps:true})
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
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Grade'})
    grade: Grade
    @Prop()
    paternalSurname: string
    @Prop()
    maternalSurname: string
    @Prop()
    firstName: string
    @Prop()
    exp: string
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Post'})
    post: Post
    @Prop()
    ci:string
    @Prop()
    gender:string
    @Prop()
    address:string
    @Prop({type:String, default:'activo'})
    status:string
    @Prop()
    isRoot:true
}

export const UsersSchema = SchemaFactory.createForClass(Users)