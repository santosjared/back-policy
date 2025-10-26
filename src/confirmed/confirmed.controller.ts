import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfirmedService } from './confirmed.service';
import { CreateConfirmedDto } from './dto/create-confirmed.dto';
import { UpdateConfirmedDto } from './dto/update-confirmed.dto';

@Controller('confirmed')
export class ConfirmedController {
  constructor(private readonly confirmedService: ConfirmedService) {}

  @Post()
  create(@Body() createConfirmedDto: CreateConfirmedDto) {
    return this.confirmedService.create(createConfirmedDto);
  }

  @Get()
  findAll() {
    return this.confirmedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.confirmedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfirmedDto: UpdateConfirmedDto) {
    return this.confirmedService.update(+id, updateConfirmedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.confirmedService.remove(+id);
  }
}
