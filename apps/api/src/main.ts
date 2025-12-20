import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Dynamic CORS
  const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'];
  app.enableCors({ origin: allowedOrigins, credentials: true });

  // Cloud Run Port Binding
  await app.listen(process.env.PORT || 8080, '0.0.0.0');
  console.log(`Kibo API running on port ${process.env.PORT || 8080}`);
}
bootstrap();
