import { BadRequestException } from '@nestjs/common';

export const fileFilter = (req, file: Express.Multer.File, callback: Function) => {
  if (file.fieldname === 'images') {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      
      return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png)'), false);
    }
  } else if (file.fieldname === 'video') {
    if (!file.mimetype.match(/\/(mp4|avi|mov|wmv)$/)) {
      return callback(new BadRequestException('Solo se permiten videos (mp4, avi, mov, wmv)'), false);
    }
  }
  callback(null, true);
};
