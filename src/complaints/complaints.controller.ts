import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateTypeComplaintsDto } from './dto/create-type-complaints.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs'
import { fileFilter } from 'src/utils/validator/file';
import { UpdateTypeComplaintsDto } from './dto/update-type-complaints.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { Action } from 'src/config/acl';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator';

@Controller('complaints')
// @ApiBearerAuth()
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Create, subject: 'complaints' })
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

  // @UseGuards(JwtAuthGuard)
  @Get('type-complaints')
  async typeComplaints (@Query() filters:any) {
    return await this.complaintsService.findAllTypeComplaint(filters)
  }

  // @UseGuards(JwtAuthGuard)
  @Get('kin')
  async Kin(){
    return await this.complaintsService.findAllKing()
  }
  
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(+id);
  }

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Update, subject: 'complaints' })
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

  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: Action.Delete, subject: 'complaints' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.complaintsService.remove(id);
  }
}
