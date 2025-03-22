import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomErrorFilter } from './prisma/prisma.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 9000);
}
bootstrap();
