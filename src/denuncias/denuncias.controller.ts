import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';

@Controller('denuncias')
export class DenunciasController {
  constructor(private readonly denunciasService: DenunciasService) {}

  @Post()
  create(@Body() createDenunciaDto: CreateDenunciaDto) {
    return this.denunciasService.create(createDenunciaDto);
  }

  @Get()
  findAll() {
    return this.denunciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.denunciasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDenunciaDto: UpdateDenunciaDto) {
    return this.denunciasService.update(+id, updateDenunciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.denunciasService.remove(+id);
  }
}
