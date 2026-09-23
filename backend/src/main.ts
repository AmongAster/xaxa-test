import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { AuditService } from './audit/audit.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Безопасность (152-ФЗ / ФСТЭК 117), п.4 ТЗ ---
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 минут
      max: 300, // запросов с одного IP за окно
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Валидация DTO: лишние поля отклоняются, а не молча игнорируются
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // // AuditLogInterceptor берём из DI-контейнера (ему нужен AuditService)
  // const auditService = app.get(AuditService);
  // app.useGlobalInterceptors(new AuditLogInterceptor(auditService));

  // --- Swagger, п.4 ТЗ ---
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CRM ИТ Школа Ростелекома — API')
    .setDescription('Backend для контроля взаимодействия с ВУЗами')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`CRM backend запущен на http://localhost:${port}, Swagger: /api/docs`);
}

bootstrap();