import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getConfig from './config/environment'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});

  const config = new DocumentBuilder()
    .setTitle('API REST for policy')
    .setDescription('Esto es un api para manejo de policias')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('policy', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(getConfig().PORT,'0.0.0.0');
}
bootstrap();
