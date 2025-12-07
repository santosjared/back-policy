import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Permission, PermissionDocument } from "src/roles/schema/persmissions.schema";
import { Rol, RolDocument } from "src/roles/schema/roles.schema";
import { Users, UsersDocument } from "src/users/schema/users.schema";
import { permissions } from "src/utils/permissions";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { Auth, AuthDocument } from "src/auth/schema/auth.schema";

@Injectable()
export class AdminSeedService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
    @InjectModel(Rol.name) private readonly rolModel: Model<RolDocument>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private readonly configService: ConfigService,
  ) { }

  async seed() {
    try {
      console.log("Ejecutando seed del usuario ROOT...");

      const rootEmail = this.configService.get<string>("ROOT_EMAIL");
      const rootPassword = this.configService.get<string>("ROOT_PASSWORD");
      const rootName = this.configService.get<string>("ROOT_NAME");

      let rootRole = await this.rolModel.findOne({ isRoot: true });

      await this.permissionModel.deleteMany({ isRoot: true });

      const permissionsIds = await Promise.all(
        permissions.map(async (perm) => {
          const newPerm = await this.permissionModel.create({
            ...perm,
            isRoot: true,
          });
          return newPerm._id;
        }),
      );

      if (rootRole) {
        rootRole.permissions = permissionsIds;
        await rootRole.save();
      } else {
        rootRole = await this.rolModel.create({
          name: "Root",
          description: "Rol con todos los permisos",
          isRoot: true,
          permissions: permissionsIds,
        });
      }

      const passwordHash = await bcrypt.hash(rootPassword, 10);
      const rootUser = await this.userModel.findOne({ isRoot: true });

      const rootUserData = {
        firstName: rootName,
        email: rootEmail,
        rol: rootRole._id,
        isRoot: true,
      };

      if (rootUser) {
        await this.userModel.findByIdAndUpdate(rootUser._id, rootUserData);
      } else {
        await this.userModel.create(rootUserData);
      }

      const auth = await this.authModel.findOne({ isRoot: true });

      if (auth) {
        await this.authModel.findOneAndUpdate({ isRoot: true }, { email: rootEmail, password: passwordHash });
      } else {
        await this.authModel.create({ email: rootEmail, password: passwordHash, isRoot: true });
      }

      console.log("✅ Seed del usuario ROOT completado correctamente.");
    } catch (error) {
      console.error("❌ Error ejecutando seed del administrador ROOT:", error);
    }
  }
}
