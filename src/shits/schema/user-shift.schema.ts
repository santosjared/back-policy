import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Users } from "src/users/schema/users.schema";

export type UserShiftDocument = HydratedDocument<UserShift>

@Schema()
export class UserShift {
    @Prop()
    cargo: string
    @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Users' })
    user: Users
}

export const UserShiftSchema = SchemaFactory.createForClass(UserShift);