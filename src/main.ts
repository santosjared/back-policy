import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getConfig from './config/environment'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(getConfig().PORT,'0.0.0.0');
}
bootstrap();
