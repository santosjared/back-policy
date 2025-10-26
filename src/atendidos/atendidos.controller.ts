import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { AtendidosService } from './atendidos.service';
import { CreateAtendidoDto } from './dto/create-atendido.dto';
import { UpdateAtendidoDto } from './dto/update-atendido.dto';
import { FiltersPatrolsDto } from 'src/patrols/dto/filters-patrols.dto';

@Controller('atendidos')
export class AtendidosController {
  constructor(private readonly atendidosService: AtendidosService) {}

  @Post()
  async create(@Body() createAtendidoDto: CreateAtendidoDto) {
    return await this.atendidosService.create(createAtendidoDto);
  }

  @Get()
  async findAll(@Query() filters: FiltersPatrolsDto) {
    return await this.atendidosService.findAll(filters);
  }
  @Get('patrols')
  async findPatrols(@Query() filters: FiltersPatrolsDto) {
    return await this.atendidosService.Patrols(filters);
  }

  @Get('shifts')
  async findShifts() {
    return await this.atendidosService.findCurrentShiftsWithActiveUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atendidosService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAtendidoDto: UpdateAtendidoDto) {
    return await this.atendidosService.update(id, updateAtendidoDto);
  }

}
