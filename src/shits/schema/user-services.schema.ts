import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UserShift } from "./user-shift.schema";
import { Services } from "./services.schema";
import { Zone } from "./zone.schema";

export type UserServicesDocument = HydratedDocument<UserServices>

@Schema()
export class UserServices {
        @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Services'})
        services: Services
        @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Zone'})
        zone: Zone
        @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'UserShift'}]})
        users: UserShift[]
}

export const UserServicesSchema = SchemaFactory.createForClass(UserServices);