import { Controller, Post, Body, Param, Put, Get, UseGuards } from '@nestjs/common';
import { ConfirmedService } from './confirmed.service';
import { CreateConfirmedDto } from './dto/create-confirmed.dto';
import { UpdateConfirmedDto } from './dto/update-confirmed.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator';

@Controller('confirmed')
export class ConfirmedController {
  constructor(private readonly confirmedService: ConfirmedService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'atender' })
  @Post()
  create(@Body() createConfirmedDto: CreateConfirmedDto) {
    return this.confirmedService.create(createConfirmedDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'atender' })
  @Get('type-complaints')
  typecomplaints() {
    return this.confirmedService.typecomplaints();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'atender' })
  @Get(':id')
  atendido(@Param('id') id: string) {
    return this.confirmedService.atendido(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'atender' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateConfirmedDto: UpdateConfirmedDto) {
    return this.confirmedService.update(id, updateConfirmedDto);
  }

}
