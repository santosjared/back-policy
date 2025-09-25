import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = MongoAbility<[Action, string]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly roleService: RolesService) {}

  async buildAbilityFor(user: any): Promise<AppAbility> {
    const role = await this.roleService.findOne(user.role);
    const permissions = role.permissions;

    const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

    //   permissions.forEach(permission => {
    //     permission.action.map(action => can(action.name as Action, permission.subject.name));
    // })

    return createMongoAbility(rules) as AppAbility; 
  }
}
