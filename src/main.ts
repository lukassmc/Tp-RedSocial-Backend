import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  if (process.env.VERCEL === 'true') {
    return;
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:4200",
      "https://tp-red-social-noisy.vercel.app"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
