import { Actions, Subjects } from "src/types/PermissionTypes";

export type Permission = {
  subject: Subjects
  action: Actions[]
}
export const permissions: Permission[] = [
    { subject: 'dashboard', action: ['read'] },
    { subject: 'users', action: ['read', 'create', 'update', 'delete'] },
    { subject: 'roles', action: ['read', 'create', 'update', 'delete', 'permissions'] },
    { subject: 'shifts', action: ['read', 'create', 'update', 'delete', 'personal', 'print'] },
    { subject: 'vehicles', action: ['read', 'create', 'update', 'delete'] },
    { subject: 'complaints', action: ['read', 'create', 'update', 'delete'] },
    { subject: 'recibidos', action: ['read', 'acepted', 'refused'] },
    { subject: 'asignes', action: ['confirmed', 'print', 'read', 'look'] },
    { subject: 'atender', action: ['read', 'create', 'update', 'delete'] },
];