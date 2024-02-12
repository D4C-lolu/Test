import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  GlobalExceptionsFilter,
  ValidationExceptionFilter,
} from './common/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ValidationExceptionFilter());

  await app.listen(3000);
}
bootstrap();
