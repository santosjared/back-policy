import { Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Rol, RolDocument } from 'src/roles/schema/roles.schema';
import { Grade, GradeDocument } from './schema/grade.schema';
import { Post, PostDocument } from './schema/post.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly userService: Model<UsersDocument>,
    @InjectModel(Rol.name) private readonly RolService: Model<RolDocument>,
    @InjectModel(Grade.name) private readonly GradeService: Model<GradeDocument>,
    @InjectModel(Post.name) private readonly PostService: Model<PostDocument>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password,10);

    if(createUserDto.otherGrade){
      const newGrade = await this.GradeService.create({name:createUserDto.otherGrade})
      createUserDto.grade = newGrade._id.toString();
    }
    if(createUserDto.otherPost){
      const newPost = await this.PostService.create({name:createUserDto.otherPost})
      createUserDto.post = newPost._id.toString();
    }
     return await this.userService.create({...createUserDto, password})
  }

  async findAll(filters: any) {
    if (filters && filters.filter) {
      const matchedRoles = await this.RolService.find({ name: { $regex: filters.filter, $options: 'i' } }).select('_id')
      const matchedGrades = await this.GradeService.find({ name: { $regex: filters.filter, $options: 'i' } }).select('_id')
      const matchedPost = await this.PostService.find({ name: { $regex: filters.filter, $options: 'i' } }).select('_id')
      const query = {
        $or: [
          { grade: { $in: matchedGrades.map(g => g._id) } },
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
          { post: { $in: matchedPost.map(p => p._id) } },
          { status: { $regex: filters.filter, $options: 'i' } },
          { rol: { $in: matchedRoles.map(r => r._id) } }
        ]
      }

      const result = await this.userService.find(query).select('-password -__v').populate('rol grade post').skip(filters.skip).limit(filters.limit).exec()
      const total = await this.userService.countDocuments(query)
      return { result, total };
    }
    const result = await this.userService.find().select('-password -__v').populate('rol grade post')
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

  if (updateUserDto.otherGrade) {
    const newGrade = await this.GradeService.create({ name: updateUserDto.otherGrade })
    updateData.grade = newGrade._id.toString()
  }
  if (updateUserDto.otherPost) {
    const newPost = await this.PostService.create({ name: updateUserDto.otherPost })
    updateData.post = newPost._id.toString()
  }

  return await this.userService.findByIdAndUpdate(id, updateData)
}

  async dow(id: string) {
    return await this.userService.findByIdAndUpdate(id,{status:'inactivo'});
  }
  async up(id: string){
    return await this.userService.findByIdAndUpdate(id,{status:'activo'})
  }
   async checkEmail(email:string){
        return await this.userService.findOne({email}) !==null;
    }

    async findGrade(){
      return await this.GradeService.find();
    }
    async findPost(){ 
      return await this.PostService.find(); 
    }
}
