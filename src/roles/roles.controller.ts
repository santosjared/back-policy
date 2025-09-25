import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth} from '@nestjs/swagger';
import { CreateRolDto } from './dto/create-roles.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { CreatePermissionDto } from 'src/permissions/dto/create-permission.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'
import { Action } from 'src/config/acl';

@Controller('roles')
// @ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  
  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Create, subject: 'roles' })
  @Post()
  create(@Body() createRolDto:CreateRolDto){
    return this.rolesService.create(createRolDto);
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Read, subject: 'roles' })
  @Get()
  async findAll(@Query() filters:any){
    return await this.rolesService.findAll(filters)
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Update, subject: 'roles' })
  @Put(':id')
  async update(@Param('id') id:string, @Body() updateRolDto:UpdateRolDto){
    return await this.rolesService.update(id, updateRolDto)
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Update, subject: 'roles' })
  @Put('asigne-permissions/:id')
  async asignePermission(@Param('id')id:string, @Body() createPermission:CreatePermissionDto){
    return await this.rolesService.asignePermission(id,createPermission)
  }
  
  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Delete, subject: 'roles' })
  @Delete(':id')
  async delete(@Param('id') id:string){
    return await this.rolesService.delete(id)
  }

}
