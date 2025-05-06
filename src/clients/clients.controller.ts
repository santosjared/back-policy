import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClienteDto } from './dto/update-client.dto';

@Controller('clients')
@ApiTags('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto){
    return this.clientsService.create(createClientDto);
  }
  @Get('check-email/:email')
  async checkEmail(@Param('email') email:string){
    const result = await this.clientsService.checkEmail(email)
    return {result}
  }
  @Get(':email')
  async findOne (@Param('email') email:string){
    const result = await this.clientsService.findOne(email);
    return {result};
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateClientDto:UpdateClienteDto){
    console.log(updateClientDto)
    return this.clientsService.update(id, updateClientDto);
  }
}
