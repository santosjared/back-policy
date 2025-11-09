import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { Actions, Subjects } from 'src/types/PermissionTypes';
import { UsersDocument } from 'src/users/schema/users.schema';



export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly roleService: RolesService) {}

  async buildAbilityFor(user: UsersDocument): Promise<AppAbility> {
    const role = await this.roleService.findOne(user.rol.toString());

    const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

      role.permissions?.forEach((permission: { action: Actions[]; subject: Subjects; }) => {
        permission.action?.map((action: string) => can(action as Actions, permission.subject));
    })

    return createMongoAbility(rules) as AppAbility; 
  }
}
