import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
constructor(@InjectModel(Users.name) private readonly UserService:Model<UsersDocument>,
private jwtService: JwtService
){}
  async login(createAuthDto:CreateAuthDto){
    const user = await this.UserService.findOne({email:createAuthDto.email});
    if(user){
        const passwordHash = await bcrypt.compare(createAuthDto.password,user.password);
        if(passwordHash){
          const payload = {userId:user._id}
          return {
            access_token: this.jwtService.sign(payload),
          };
        }
        throw new UnauthorizedException('password incorect')
    }
    throw new UnauthorizedException('email incorect')
  }
  async verifyToken(){
    
  }
  async loguot(token:string){

  }

}
