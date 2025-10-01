import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Users } from "src/users/schema/users.schema";

export type ShitsDocument = HydratedDocument<Shits>

@Schema({ timestamps: true })
export class Shits {
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Users'})
    supervisor: string
    @Prop()
    date: string
    @Prop()
    hrs: HourRange[]
}

class HourRange {
    @Prop()
    name: string
    @Prop()
    hrs_i: string
    @Prop()
    hrs_s: string
    @Prop()
    services: Services[]
}

class Services {
    @Prop()
    name: string
    @Prop()
    otros: string
    @Prop()
    users: User[]
}
class User {
    @Prop()
    cargo:string
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Users'})
    user:Users
}

export const ShitSchema = SchemaFactory.createForClass(Shits);