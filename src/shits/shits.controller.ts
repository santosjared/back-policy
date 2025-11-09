import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { ShitsService } from './shits.service';
import { CreateShitDto } from './dto/create-shit.dto';
import { UpdateShitDto } from './dto/update-shit.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator';
import { FiltersShiftsDto } from './dto/filters-shifts.dto';

@Controller('shits')
export class ShitsController {
  constructor(private readonly shitsService: ShitsService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'shifts' })
  @Post()
  async create(@Body() createShitDto: CreateShitDto) {
    return await this.shitsService.create(createShitDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'shifts' })
  @Get()
  async findAll(@Query() filtrs: FiltersShiftsDto) {
    return await this.shitsService.findAll(filtrs);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'personal', subject: 'shifts' })
  @Get('users')
  async users() {
    return await this.shitsService.users();
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'personal', subject: 'shifts' })
  @Get('users-available')
  async usersAvailable() {
    return await this.shitsService.users();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'personal', subject: 'shifts' })
  @Get('services')
  async findAllServices() {
    return await this.shitsService.findAllServices();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'personal', subject: 'shifts' })
  @Get('zones')
  async findAllZones() {
    return await this.shitsService.findAllZones();
  }
  @Get(':id')

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'shifts' })
  async findOne(@Param('id') id: string) {
    return await this.shitsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'shifts' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateShitDto: UpdateShitDto) {
    return await this.shitsService.update(id, updateShitDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'delete', subject: 'shifts' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.shitsService.remove(id);
  }
}
