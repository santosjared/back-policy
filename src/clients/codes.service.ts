import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Codes, CodesDocument } from './schema/codes.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Codes.name) private readonly codesModel: Model<CodesDocument>,
    private jwtService: JwtService
  ) {}

  async generateCode(email: string): Promise<Codes> {
    const code = Math.floor(100000 + Math.random() * 900000); 
    const expire = new Date(Date.now() + 10 * 60 * 1000);

    const payload = { email, code, expire };

    return await this.codesModel.findOneAndUpdate(
      { email },
      payload,
      { upsert: true, new: true }
    );
  }

  async verifyCode(email: string, inputCode: number) {
    const record = await this.codesModel.findOne({ email });

    if (!record) throw new UnauthorizedException();

    const isValid = record.code === inputCode && record.expire > new Date();
    
    if(isValid) {
       const  token = this.jwtService.sign({ email },{expiresIn: '15m'});
       return {token}
    }
    throw new UnauthorizedException();
  }
}
