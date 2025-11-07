import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Client } from 'src/clients/schema/clients.schema';
import { Kin } from 'src/complaints/schema/kin.schema';
import { TypeComplaint } from 'src/complaints/schema/type-complaints.schema';


export type ComplaintsClientDocument = HydratedDocument<ComplaintsClient>


@Schema({timestamps:true})
export class ComplaintsClient{

    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'Client'})
    userId:Client

    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'TypeComplaint'})
    complaints:TypeComplaint

    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'Kin'})
    aggressor:Kin

    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'Kin'})
    victim:Kin

    @Prop()
    place:string

    @Prop()
    description:string

    @Prop()
    latitude:number

    @Prop()
    longitude:number

    @Prop()
    images:Array<string>

    @Prop()
    video:string

    @Prop()
    otherComplaints:string

    @Prop()
    otherAggresor:string

    @Prop()
    otherVictim:string

    @Prop()
    status:string

    @Prop()
    contact?:string

}



export const ComplaintsClientSchema = SchemaFactory.createForClass(ComplaintsClient)