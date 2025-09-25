import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { ShitsService } from './shits.service';
import { CreateShitDto } from './dto/create-shit.dto';
import { UpdateShitDto } from './dto/update-shit.dto';
import { FilterShitDto } from './dto/filter-shit.dto';

@Controller('shits')
export class ShitsController {
  constructor(private readonly shitsService: ShitsService) {}

  @Post()
  async create(@Body() createShitDto: CreateShitDto) {
    return await this.shitsService.create(createShitDto);
  }

  @Get()
  async findAll(@Query() filtrs: any) {
    return await this.shitsService.findAll(filtrs);
  }

  @Get('users')
  async users() {
    return await this.shitsService.users();
  }
   @Get('users-available')
  async usersAvailable() {
    return await this.shitsService.users();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.shitsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateShitDto: UpdateShitDto) {
    return await this.shitsService.update(id, updateShitDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.shitsService.remove(id);
  }
}
