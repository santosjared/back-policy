import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator';
import { Action } from 'src/config/acl';

@Controller('permissions')
// @ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Create, subject: 'permissions' })
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Read, subject: 'permissions' })
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Read, subject: 'permissions' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Update, subject: 'permissions' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Delete, subject: 'permissions' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
