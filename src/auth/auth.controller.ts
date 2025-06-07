import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefresTokenDto } from './dto/refresh-token.dto';
import { AuthGoogleDto } from './dto/auth-google.dto';
import { GoogleAuthService } from './google-auth.service';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly authGoogleService:GoogleAuthService,
  ) {}

  @Post()
  async create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }
  @Post('refresh-token')
  async refresToken(@Body() tokenRefresh:RefresTokenDto){
    return await this.authService.refreshToken(tokenRefresh.token)
  }
  @Post('google')
  async googleAuth (@Body() createAcount:AuthGoogleDto){
    return await this.authGoogleService.verifyIdToken(createAcount)
  }
  @Put('reset-password')
  async resetPassword(@Body() updateAuthDto:UpdateAuthDto){
    return await this.authService.resetPassword(updateAuthDto);
  }
  @Delete('logout/:id')
  async logout(@Param('id') id:string){
    return this.authService.logout(id);
  }
}
