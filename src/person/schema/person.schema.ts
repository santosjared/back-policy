import { Prop} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Rol } from 'src/roles/schema/roles.schema';

export class Person extends Document {
        @Prop({required:true})
        name:string
        @Prop({required:true})
        lastName:string
        @Prop({unique:true, required:true})
        email:string
        @Prop({required:true})
        password:string
        @Prop({required:true})
        phone:string
        @Prop()
        profile:string
        @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Rol', required:true})
        rol:Rol
}
