import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Query, Put, UseGuards } from '@nestjs/common';
import { PatrolsService } from './patrols.service';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { UpdatePatrolDto } from './dto/update-patrol.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
import { FiltersPatrolsDto } from './dto/filters-patrols.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator';

@Controller('patrols')
export class PatrolsController {
  constructor(private readonly patrolsService: PatrolsService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'vehicles' })
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let folderPath = '';

          if (file.fieldname === 'image') {
            folderPath = './uploads/images';
          } else {
            return cb(new Error('Campo no permitido'), '');
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
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async create(@Body() createPatrolDto: CreatePatrolDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createPatrolDto.imageUrl = file.filename || null;
    }
    return await this.patrolsService.create(createPatrolDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'vehicles' })
  @Get()
  async findAll(@Query() filters: FiltersPatrolsDto) {
    return await this.patrolsService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'vehicles' })
  @Get('types')
  async findType() {
    return await this.patrolsService.findType();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'vehicles' })
  @Get('markers')
  async findMarker() {
    return await this.patrolsService.findMarker();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'vehicles' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.patrolsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'vehicles' })
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let folderPath = '';

          if (file.fieldname === 'image') {
            folderPath = './uploads/images';
          } else {
            return cb(new Error('Campo no permitido'), '');
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
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async update(@Param('id') id: string, @Body() updatePatrolDto: UpdatePatrolDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      updatePatrolDto.imageUrl = file.filename || null;
    }
    return await this.patrolsService.update(id, updatePatrolDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'delete', subject: 'vehicles' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.patrolsService.remove(id);
  }
}
