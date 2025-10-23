import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Patrols } from "src/patrols/schema/patrols.schema";
import { UserShift } from "src/shits/schema/user-shift.schema";

export type UserPatrolsDocument = HydratedDocument<UserPatrols>

@Schema()
export class UserPatrols {
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Patrols'})
    patrols:Patrols
    @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'UserShift'}]})
    user:UserShift[]
}

export const UserPatrolsSchema = SchemaFactory.createForClass(UserPatrols)