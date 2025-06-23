import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Dashboard API')
    .setDescription('API документация для Dashboard')
    .setVersion('1.0')
    .addTag('dashboard')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Введите ваш JWT токен',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const swaggerPath = configService.get<string>('SWAGGER_PATH')!;
  const swaggerURL = configService.get<string>('SWAGGER_URL')!;
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, documentFactory);

  const port = configService.get<number>('APP_PORT');
  await app.listen(port!);
  Logger.log(`Application successfully started on port: ${port}`, 'Bootstrap');
  Logger.log(
    `Swagger url is: ${swaggerURL}:${port}/${swaggerPath}`,
    'Bootstrap',
  );
}
bootstrap();
