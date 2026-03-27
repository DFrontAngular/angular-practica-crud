import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as fs from 'node:fs';
import { join } from 'node:path';
import * as swaggerUi from 'swagger-ui-express';
import { AppModule } from './src/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));
  app.useStaticAssets(join(process.cwd(), 'public'));

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
