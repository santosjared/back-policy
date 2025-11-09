import { Controller, Get, Post, Body, Param, Query, Put, UseGuards, Delete } from '@nestjs/common';
import { AtendidosService } from './atendidos.service';
import { CreateAtendidoDto } from './dto/create-atendido.dto';
import { FiltersPatrolsDto } from 'src/patrols/dto/filters-patrols.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator';
import { FiltersAtendidosDto } from './dto/filters-atendido.dto';

@Controller('atendidos')
export class AtendidosController {
  constructor(private readonly atendidosService: AtendidosService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'acepted', subject: 'recibidos' })
  @Post()
  async create(@Body() createAtendidoDto: CreateAtendidoDto) {
    return await this.atendidosService.create(createAtendidoDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'recibidos' })
  @Get()
  async findAll(@Query() filters: FiltersAtendidosDto) {
    return await this.atendidosService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'acepted', subject: 'recibidos' })
  @Get('patrols')
  async findPatrols(@Query() filters: FiltersPatrolsDto) {
    return await this.atendidosService.Patrols(filters);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'acepted', subject: 'recibidos' })
  @Get('shifts')
  async findShifts() {
    return await this.atendidosService.findCurrentShiftsWithActiveUsers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'refused', subject: 'recibidos' })
  @Delete(':id')
  async refusedComplaint(@Param('id') id: string) {
    return await this.atendidosService.refusedComplaint(id)
  }

}
