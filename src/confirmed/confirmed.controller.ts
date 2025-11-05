import { Controller, Post, Body, Param, Put } from '@nestjs/common';
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

  @Put(':id')
  update(@Param('id') id: string, @Body() updateConfirmedDto: UpdateConfirmedDto) {
    return this.confirmedService.update(id, updateConfirmedDto);
  }

}
