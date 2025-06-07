import { Prop} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Rol } from 'src/roles/schema/roles.schema';

export class Person extends Document {
        @Prop()
        name?:string
        @Prop()
        lastName?:string
        @Prop({unique:true, required:true})
        email:string
        @Prop()
        password?:string
        @Prop()
        phone?:string
        @Prop()
        picture?:string
        @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Rol', required:true})
        rol:Rol
}
