import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type AuthDocument = HydratedDocument<Auth>;

@Schema({timestamps:true, autoIndex: false })
export class Auth {
    @Prop({ required: true, unique: false})
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({default:false})
    isRoot:boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);