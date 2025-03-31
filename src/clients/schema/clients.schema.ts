import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Person } from '../../person/schema/person.schema';
import { HydratedDocument } from 'mongoose';

export type ClientDocumnet = HydratedDocument<Client>

@Schema()
export class Client extends Person {};

export const ClientSchema = SchemaFactory.createForClass(Client);