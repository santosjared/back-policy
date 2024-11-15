import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import { Contry, ContryDocument } from './schema/contry.schema';
import { Gender, GenderDocument } from './schema/gender.schema';
import { renameSync } from 'fs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly UserService:Model<UsersDocument>,
  @InjectModel(Contry.name) private readonly ContryService:Model<ContryDocument>,
  @InjectModel(Gender.name) private readonly GenderService:Model<GenderDocument>
){}
  async create(createUserDto: CreateUserDto,file?:Express.Multer.File) {
    const gender = await this.GenderService.create({name:createUserDto.gender});
    const contry = await this.ContryService.create({name:createUserDto.contry});
    const hash = await bcrypt.hash(createUserDto.password, 10);
    if(file){
      renameSync(file.path, `./uploads/${file.originalname}`);
      return await this.UserService.create({...createUserDto, 
        profile:`./uploads/${file.originalname}`,
        gender:gender._id,
        contry:contry._id,
        password:hash
      })
    }
    return await this.UserService.create({...createUserDto, gender:gender._id, contry:contry._id,password:hash}) ;
  }

  async findAll() {
    return this.UserService.find().populate('gender').populate('contry');
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
