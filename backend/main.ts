import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as fs from 'fs';
import * as swaggerUi from 'swagger-ui-express';
import { AppModule } from './src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow class-validator to use NestJS dependency injection container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NTT Demo Vehicle Catalog API')
    .setDescription(
      'Backend API for the NTT Angular practice: authentication, vehicle catalog, brands, models, pagination and role-based access.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.components = document.components || {};
  document.components.securitySchemes = {
    bearer: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  };
  document.security = [{ bearer: [] }];

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));

  // Save Swagger JSON file locally
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  console.log('The Swagger JSON file has been saved as swagger.json');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
