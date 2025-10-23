import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Actions, Permission, PermissionDocument, Subjects } from '../permissions/schema/persmissions.schema';
import { Rol, RolDocument } from '../roles/schema/roles.schema';
import { Users, UsersDocument } from '../users/schema/users.schema';

interface Permissions {
  subject: Subjects
  action: Actions[]
}

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
    @InjectModel(Rol.name) private readonly rolModel: Model<RolDocument>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async seed() {
    try {
      console.log('Running seed users...');

      const permissions:Permissions[] = [
        { subject: 'all', action: ['manage'] },
      ];

      const addPermissions = permissions.map((permission) => ({
        updateOne: {
          filter: { subject: permission.subject },
          update: { $setOnInsert: permission },
          upsert: true,
        },
      }));

      await this.permissionModel.bulkWrite(addPermissions);

      const permissiondb = await this.permissionModel.find();
      const permissionIds = permissiondb.map((p) => p._id);

      let adminRole = await this.rolModel.findOne({ name: 'admin' });

      if (!adminRole) {
        adminRole = await this.rolModel.create({
          name: 'admin',
          permissions: permissionIds,
        });
      }

      const existingAdmin = await this.userModel.findOne({ email: 'admin@gmail.com' });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        await this.userModel.create({
          firstName: 'admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
          rol: adminRole._id,
          grade:'Admistrador',
        });
      }

      console.log('Seed complete admin ✅');
    } catch (error) {
      console.error('Seed error users:', error);
    }
  }
}
