import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClienteDto } from './dto/update-client.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { CodesService } from './codes.service';
import { MailService } from './mail.service';

@Controller('clients')
@ApiTags('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService, 
    private readonly codesService:CodesService,
    private readonly mailService:MailService
  ) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto){
    return this.clientsService.create(createClientDto);
  }
  @Post('verifay-email')
  async sendToCode(@Body() sendToEmail:SendEmailDto){
    const email = await this.clientsService.checkEmail(sendToEmail.email);
    if(email){
      const code = await this.codesService.generateCode(sendToEmail.email);
      const send = await this.mailService.sendMail(sendToEmail.email,code.code)
      return send !==null
    }
    return email
  }
  @Post('verifay-code')
  async verifyCode(@Body() createDto:SendEmailDto){
    return await this.codesService.verifyCode(createDto.email, parseInt(createDto.code, 10))
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
    return this.clientsService.update(id, updateClientDto);
  }
}
