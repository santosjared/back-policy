import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Person } from '../../person/schema/person.schema';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>

@Schema()
export class Client extends Person {
    @Prop()
    provider:string
};

export const ClientSchema = SchemaFactory.createForClass(Client);