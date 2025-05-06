import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  create(@Body() createDenunciaDto: CreateDenunciaDto) {
    return this.complaintsService.create(createDenunciaDto);
  }

  @Get()
  findAll() {
    return this.complaintsService.findAll();
  }

  @Get('type-complaints')
  async typeComplaints () {
    return await this.complaintsService.findAllTypeComplaint()
  }

  @Get('kin')
  async Kin(){
    return await this.complaintsService.findAllKing()
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDenunciaDto: UpdateDenunciaDto) {
    return this.complaintsService.update(+id, updateDenunciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintsService.remove(+id);
  }
}
