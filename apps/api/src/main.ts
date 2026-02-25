import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  // Dynamic CORS
  const allowedOrigins = (process.env.FRONTEND_URL || process.env.CORS_ORIGIN)?.split(',') || ['http://localhost:3000'];
  app.enableCors({ origin: allowedOrigins, credentials: true });

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);
}
bootstrap();
