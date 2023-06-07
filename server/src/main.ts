import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
const PORT = process.env.PORT || 3001 // Порт запуска

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Создание приложения
  app.useGlobalPipes(new ValidationPipe()); // Для валидации данных
  app.use(cookieParser()); // Для парсинга cookie
  app.enableCors({ credentials: true, origin: [process.env.CLIENT_HOST] }) // Для CORS
  await app.listen(PORT, () => `Started at port ${PORT}`);
}
bootstrap();
