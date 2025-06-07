import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Rol, RolDocument } from 'src/roles/schema/roles.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly userService: Model<UsersDocument>,
    @InjectModel(Rol.name) private readonly RolService: Model<RolDocument>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password,10)
     return await this.userService.create({...createUserDto, password})
  }

  async findAll(filters: any) {
    if (filters && filters.filter) {
      const matchedRoles = await this.RolService.find({ name: { $regex: filters.filter, $options: 'i' } }).select('_id')
      const query = {
        $or: [
          { grade: { $regex: filters.filter, $options: 'i' } },
          { paternalSurname: { $regex: filters.filter, $options: 'i' } },
          { maternalSurname: { $regex: filters.filter, $options: 'i' } },
          { firstName: { $regex: filters.filter, $options: 'i' } },
          { lastName: { $regex: filters.filter, $options: 'i' } },
          { exp: { $regex: filters.filter, $options: 'i' } },
          { email: { $regex: filters.filter, $options: 'i' } },
          { ci: { $regex: filters.filter, $options: 'i' } },
          { address: { $regex: filters.filter, $options: 'i' } },
          { phone: { $regex: filters.filter, $options: 'i' } },
          { gender: { $regex: filters.filter, $options:'i' } },
          { post: { $regex: filters.filter, $options: 'i' } },
          { status: { $regex: filters.filter, $options: 'i' } },
          { rol: { $in: matchedRoles.map(r => r._id) } }
        ]
      }

      const result = await this.userService.find(query).populate('rol').skip(filters.skip).limit(filters.limit).exec()
      const total = await this.userService.countDocuments(query)
      return { result, total };
    }
    const result = await this.userService.find().populate('rol')
    const total = await this.userService.countDocuments()
    return { result, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

async update(id: string, updateUserDto: UpdateUserDto) {
  const updateData: any = { ...updateUserDto }
  if (updateUserDto.password) {
    updateData.password = await bcrypt.hash(updateUserDto.password, 10)
  } else {
    delete updateData.password
  }

  return await this.userService.findByIdAndUpdate(id, updateData)
}

  async dow(id: string) {
    return await this.userService.findByIdAndUpdate(id,{status:'inactivo'});
  }
  async up(id: string){
    return await this.userService.findByIdAndUpdate(id,{status:'activo'})
  }
}
