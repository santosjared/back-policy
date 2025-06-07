import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { UpdateDenunciaDto } from './dto/update-denuncia.dto';
import { CreateTypeComplaintsDto } from './dto/create-type-complaints.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs'
import { fileFilter } from 'src/utils/validator/file';
import { UpdateTypeComplaintsDto } from './dto/update-type-complaints.dto';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @UseInterceptors(
      FileInterceptor('file',
        {
          storage: diskStorage({
            destination: (req, file, cb) => {
              let folderPath = '';
          
              if (file.fieldname === 'file') {
                folderPath = './uploads/images';
              } else {
                return cb(new Error('Campo no permitido'), null);
              }
              if (!existsSync(folderPath)) {
                mkdirSync(folderPath, { recursive: true });
              }
          
              cb(null, folderPath);
            },
          
            filename: (req, file, cb) => {
              const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
              const extension = extname(file.originalname);
              cb(null, uniqueSuffix + extension);
            },
          }),
          fileFilter,
        }
      )
    )
  create(@UploadedFile() file: Express.Multer.File,
    @Body() createTypeComplaintsDto: CreateTypeComplaintsDto) {
      const image = file.filename||null
    return this.complaintsService.create({...createTypeComplaintsDto, image});
  }

  // @Get()
  // findAll() {
  //   return this.complaintsService.findAll();
  // }

  @Get('type-complaints')
  async typeComplaints (@Query() filters:any) {
    return await this.complaintsService.findAllTypeComplaint(filters)
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
  @UseInterceptors(
      FileInterceptor('file',
        {
          storage: diskStorage({
            destination: (req, file, cb) => {
              let folderPath = '';
          
              if (file.fieldname === 'file') {
                folderPath = './uploads/images';
              } else {
                return cb(new Error('Campo no permitido'), null);
              }
              if (!existsSync(folderPath)) {
                mkdirSync(folderPath, { recursive: true });
              }
          
              cb(null, folderPath);
            },
          
            filename: (req, file, cb) => {
              const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
              const extension = extname(file.originalname);
              cb(null, uniqueSuffix + extension);
            },
          }),
          fileFilter,
        }
      )
    )
  async update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File,
  @Body() updateTypeComplaintDto: UpdateTypeComplaintsDto) {
      const image = file.filename||null
    return this.complaintsService.update(id, {...updateTypeComplaintDto, image});
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.complaintsService.remove(id);
  }
}
