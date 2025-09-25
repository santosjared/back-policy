import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors, UseGuards } from '@nestjs/common';
import { ComplaintsClientService } from './complaints.service';
import { ComplaintsClientDto } from './dto/create-complaints.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter } from 'src/utils/validator/file';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { NotificationGatewey } from 'src/notifications/gateway';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('complaints-client')
// @ApiBearerAuth()
export class ComplaintsClientController {

  constructor(private readonly complaitsService: ComplaintsClientService,
    private readonly notificationGatewey: NotificationGatewey
  ) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 3 },
        { name: 'video', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            let folderPath = '';

            if (file.fieldname === 'images') {
              folderPath = './uploads/images';
            } else if (file.fieldname === 'video') {
              folderPath = './uploads/videos';
            } else {
              return cb(new Error('Campo no permitido'), null);
            }

            // Verificar si la carpeta existe, si no, crearla
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
  async create(
    @UploadedFiles() files: { images?: Express.Multer.File[]; video?: Express.Multer.File[] },
    @Body() createComplaints: ComplaintsClientDto,
  ) {
    const imageFilenames = files.images?.map((file) => file.filename) || [];
    const videoFilename = files.video?.length > 0 ? files.video[0].filename : null;
    const complaintData = {
      ...createComplaints,
      images: imageFilenames,
      video: videoFilename,
    };
    const response = await this.complaitsService.create(complaintData);
    this.notificationGatewey.emitNotification({})
    return response
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('userId') userId: string, @Query('status') status?: string) {
    return await this.complaitsService.findComplaintsOfUser(userId, status);
  }
  // @UseGuards(JwtAuthGuard)
  @Get('complaints-with-status')
  async findAllWithStatus(
    @Query('status') status: string,
    @Query('skip') skip:string,
    @Query('limit') limit:string,
    @Query('name') name:string,
    @Query('date') date:string
  ) {
    if(skip && limit){
       const skipNumber = parseInt(skip, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.complaitsService.findAllWithStatus(status, skipNumber, limitNumber, name, date);
    }
    return await this.complaitsService.findAllWithStatus(status);
  }
  // @UseGuards(JwtAuthGuard)
  @Delete('complaints-refused/:id')
  async refusedComplaint(@Param('id') id: string){
    return await this.complaitsService.refusedComplaint(id)
  }

}