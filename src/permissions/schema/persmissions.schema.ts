import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'
export type Subjects = 'all' | 'usuarios' | 'roles' | 'denuncias' | 'home' | 'recibidos' | 'asignados' | 'atender' | 'vehiculos' | 'turnos'

@Schema()
export class Permission {
    @Prop()
    action: Actions[]
    @Prop()
    subject: Subjects;
}

export const PermissionsSchema = SchemaFactory.createForClass(Permission);