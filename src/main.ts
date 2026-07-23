import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import helmet from 'helmet';
const cookieParser = require('cookie-parser');



async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ── HTTP Security Headers (OWASP: Security Misconfiguration) ──────────────
  app.use(helmet());

  // ── CORS (OWASP: Broken Access Control) ──────────────────────────────────
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Global Validation (OWASP: Injection / Input Validation) ───────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strip unknown properties
      forbidNonWhitelisted: true, // reject unknown properties
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  // ── Global Exception Filter (no internal leak) ────────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ── API Prefix ────────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Swagger (development only) ────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  app.use(cookieParser());


  const port = parseInt(process.env.APP_PORT || '3000', 10);
  await app.listen(port);

}
bootstrap();
