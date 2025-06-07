import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CodesDocument = HydratedDocument<Codes>;

@Schema()
export class Codes {
  @Prop()
  email: string;

  @Prop()
  code: number;

  @Prop({ expires: 0 })
  expire: Date;
}

export const CodesSchema = SchemaFactory.createForClass(Codes);
