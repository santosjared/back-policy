import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {  ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator';
import { Action } from 'src/config/acl';

@Controller('users')
// @ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Create, subject: 'users' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

    @Get('check-email/:email')
    async checkEmail(@Param('email') email:string){
      return await this.usersService.checkEmail(email)
    }
  
  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Read, subject: 'users' })
  @Get()
  async findAll(@Query() filters:any) {
    return await this.usersService.findAll(filters);
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Read, subject: 'users' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Update, subject: 'users' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Delete, subject: 'users' })
  @Delete('dow/:id')
  dow(@Param('id') id: string) {
    return this.usersService.dow(id);
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Delete, subject: 'users' })
  @Delete('up/:id')
  up(@Param('id') id: string) {
    return this.usersService.up(id);
  }
}
