import * as fs from 'node:fs';
import * as path from 'node:path';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CarsService } from './../src/cars/cars.service';

type AuthMode = 'true' | 'false';

describe('Backend hardening (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let plateCounter = 1200;

  const createApp = async (authEnabled: AuthMode): Promise<INestApplication> => {
    process.env.AUTH_ENABLED = authEnabled;
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.API_DELAY_ENABLED = 'false';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const nestApp = moduleFixture.createNestApplication();
    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await nestApp.init();

    return nestApp;
  };

  const uniquePlate = (): string => {
    plateCounter += 1;
    const suffixes = ['BCD', 'FGH', 'JKL', 'MNP', 'RST', 'VWX', 'XYZ'];
    return `${plateCounter} ${suffixes[plateCounter % suffixes.length]}`;
  };

  const createCarPayload = (
    licensePlate: string,
    overrides: Record<string, unknown> = {},
  ) => ({
    brandId: 'brand-1',
    modelId: 'model-1',
    carDetails: [
      {
        registrationDate: '2024-10-30T10:01:35.288Z',
        mileage: 15000,
        currency: 'EUR',
        price: 20000,
        manufactureYear: 2020,
        availability: true,
        color: 'Blue',
        description: 'Vehicle prepared for e2e tests',
        licensePlate,
        ...overrides,
      },
    ],
  });

  const createCarPayloadForBrandModel = (
    licensePlate: string,
    brandId: string,
    modelId: string,
    overrides: Record<string, unknown> = {},
  ) => ({
    brandId,
    modelId,
    carDetails: [
      {
        registrationDate: '2024-10-30T10:01:35.288Z',
        mileage: 15000,
        currency: 'EUR',
        price: 20000,
        manufactureYear: 2020,
        availability: true,
        color: 'Blue',
        description: 'Vehicle prepared for e2e tests',
        licensePlate,
        ...overrides,
      },
    ],
  });

  const login = async (
    email: string,
    password: string,
  ): Promise<{ access_token: string }> => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    return response.body;
  };

  beforeAll(async () => {
    app = await createApp('true');
    adminToken = (await login('admin@example.com', 'admin123')).access_token;
    userToken = (await login('user@example.com', 'user123')).access_token;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    fs.rmSync(path.join(process.cwd(), 'uploads'), {
      recursive: true,
      force: true,
    });
  });

  it('authenticates only with the password assigned to each user', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'user123' })
      .expect(401);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' })
      .expect(200);

    expect(response.body.user).toEqual({
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    });
  });

  it('returns the canonical authenticated user profile with auth enabled', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    });
  });

  it('returns the canonical authenticated user profile in bypass mode', async () => {
    const bypassModeApp = await createApp('false');

    try {
      const response = await request(bypassModeApp.getHttpServer())
        .get('/auth/me')
        .expect(200);

      expect(response.body).toEqual({
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
      });
    } finally {
      await bypassModeApp.close();
      process.env.AUTH_ENABLED = 'true';
    }
  });

  it('protects the seed endpoint and exposes it only as POST', async () => {
    process.env.AUTH_ENABLED = 'true';

    await request(app.getHttpServer()).get('/seed').expect(404);

    await request(app.getHttpServer())
      .post('/seed')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);

    const response = await request(app.getHttpServer())
      .post('/seed')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toEqual({
      message: 'Catalog dataset loaded successfully',
    });
  });

  it('filters correctly when available=false and rejects invalid boolean values', async () => {
    const unavailablePlate = uniquePlate();
    const availablePlate = uniquePlate();

    const unavailableCar = await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(
        createCarPayloadForBrandModel(unavailablePlate, 'brand-3', 'model-11', {
          availability: false,
        }),
      )
      .expect(201);

    await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(
        createCarPayloadForBrandModel(availablePlate, 'brand-3', 'model-12'),
      )
      .expect(201);

    const unavailableResults = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ available: 'false', licensePlate: unavailablePlate.slice(0, 4) })
      .expect(200);

    expect(unavailableResults.body.meta.itemCount).toBe(1);
    expect(unavailableResults.body.items[0].id).toBe(unavailableCar.body.id);

    const availableResults = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ available: 'true', licensePlate: unavailablePlate.slice(0, 4) })
      .expect(200);

    expect(availableResults.body.meta.itemCount).toBe(0);

    const invalidBooleanResponse = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ available: 'sometimes' })
      .expect(400);

    expect(invalidBooleanResponse.body.message).toContain(
      'available must be either true or false',
    );
  });

  it('allows keeping the same license plate on update and rejects duplicates from another car', async () => {
    const originalPlate = uniquePlate();
    const duplicatePlate = uniquePlate();

    const firstCarResponse = await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(
        createCarPayloadForBrandModel(originalPlate, 'brand-4', 'model-14'),
      )
      .expect(201);

    await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(
        createCarPayloadForBrandModel(duplicatePlate, 'brand-1', 'model-2'),
      )
      .expect(201);

    const updatedWithSamePlate = await request(app.getHttpServer())
      .put(`/cars/${firstCarResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(
        createCarPayloadForBrandModel(originalPlate, 'brand-4', 'model-14', {
          color: 'Red',
          description: 'Updated while keeping the same plate',
        }),
      )
      .expect(200);

    expect(updatedWithSamePlate.body.carDetails[0].licensePlate).toBe(
      originalPlate,
    );

    const duplicateUpdateResponse = await request(app.getHttpServer())
      .put(`/cars/${firstCarResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(
        createCarPayloadForBrandModel(duplicatePlate, 'brand-4', 'model-14'),
      )
      .expect(409);

    expect(duplicateUpdateResponse.body.message).toContain(
      'already registered to another car',
    );
  });

  it('rejects duplicated brand/model combinations on create and update', async () => {
    const firstCarResponse = await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-2', 'model-6'))
      .expect(201);

    const secondCarResponse = await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-2', 'model-7'))
      .expect(201);

    const duplicateCreateResponse = await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-2', 'model-6'))
      .expect(409);

    expect(duplicateCreateResponse.body.message).toContain(
      'Only one car per brand and model is allowed',
    );

    const duplicateUpdateResponse = await request(app.getHttpServer())
      .put(`/cars/${secondCarResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-2', 'model-6'))
      .expect(409);

    expect(duplicateUpdateResponse.body.message).toContain(
      'Only one car per brand and model is allowed',
    );

    const unchangedUpdateResponse = await request(app.getHttpServer())
      .put(`/cars/${firstCarResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(
        createCarPayloadForBrandModel(uniquePlate(), 'brand-2', 'model-6', {
          color: 'Black',
        }),
      )
      .expect(200);

    expect(unchangedUpdateResponse.body.model.id).toBe('model-6');
  });

  it('returns deterministic errors for document upload scenarios and treats missing files consistently', async () => {
    const carResponse = await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(
        createCarPayloadForBrandModel(uniquePlate(), 'brand-5', 'model-16'),
      )
      .expect(201);

    const carId = carResponse.body.id;

    await request(app.getHttpServer())
      .post(`/cars/${carId}/documents`)
      .set('Authorization', `Bearer ${adminToken}`)
      .field('title', 'Missing file')
      .expect(400);

    await request(app.getHttpServer())
      .post(`/cars/${carId}/documents`)
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.from('zip-content'), {
        filename: 'document.zip',
        contentType: 'application/zip',
      })
      .expect(415);

    await request(app.getHttpServer())
      .post(`/cars/${carId}/documents`)
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: 'large.pdf',
        contentType: 'application/pdf',
      })
      .expect(413);

    await request(app.getHttpServer())
      .post(`/cars/${carId}/documents`)
      .set('Authorization', `Bearer ${adminToken}`)
      .field('documentType', 'inspection')
      .attach('file', Buffer.from('valid-pdf-content'), {
        filename: 'inspection.pdf',
        contentType: 'application/pdf',
      })
      .expect(201);

    const carsService = app.get(CarsService);
    const storedDocument = carsService.getDocumentForDownload(carId);
    fs.unlinkSync(storedDocument.storagePath);

    await request(app.getHttpServer())
      .get(`/cars/${carId}/documents`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    await request(app.getHttpServer())
      .get(`/cars/${carId}/documents/download`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/cars/${carId}/documents`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('returns 404 for unknown brands when requesting models', async () => {
    await request(app.getHttpServer())
      .get('/brands/brand-999/models')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('generates Swagger with the corrected security and response schemas', async () => {
    const swaggerDocument = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Test API')
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    );

    expect(swaggerDocument.paths['/auth/login'].post.security).toBeUndefined();
    expect(swaggerDocument.paths['/auth/me'].get.security).toEqual([
      { bearer: [] },
    ]);
    expect(swaggerDocument.paths['/seed'].post).toBeDefined();
    expect(swaggerDocument.paths['/seed'].get).toBeUndefined();
    const brandsResponse = swaggerDocument.paths['/brands'].get.responses[
      '200'
    ] as any;
    const modelsResponse = swaggerDocument.paths['/brands/{brandId}/models'].get
      .responses['200'] as any;
    const carsResponse = swaggerDocument.paths['/cars'].get.responses[
      '200'
    ] as any;

    expect(
      brandsResponse.content['application/json'].schema.items,
    ).toEqual({ $ref: '#/components/schemas/Brand' });
    expect(
      modelsResponse.content['application/json'].schema.items,
    ).toEqual({ $ref: '#/components/schemas/Model' });

    const carsSchema = carsResponse.content['application/json'].schema;

    expect(JSON.stringify(carsSchema)).toContain('#/components/schemas/CarSummary');
  });
});
