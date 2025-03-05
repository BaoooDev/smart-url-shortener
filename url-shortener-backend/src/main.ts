import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Bật CORS để cho phép frontend truy cập
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3000);
}
bootstrap();
