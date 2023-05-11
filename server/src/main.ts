import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
const PORT = process.env.PORT || 5000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // for class validator
  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: [process.env.CLIENT_HOST] })
  await app.listen(PORT, () => `Started at port ${PORT}`);
}
bootstrap();
