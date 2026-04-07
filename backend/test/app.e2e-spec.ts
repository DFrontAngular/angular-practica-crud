import * as fs from 'node:fs';
import * as path from 'node:path';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from './../src/auth/auth.constants';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CarsService } from './../src/cars/cars.service';

type AuthMode = 'true' | 'false';

describe('Backend hardening (e2e)', () => {
  let app: INestApplication;
  let adminAccessCookie: string;
  let adminRefreshCookie: string;
  let userAccessCookie: string;
  let plateCounter = 1200;

  const createApp = async (authEnabled: AuthMode): Promise<INestApplication> => {
    process.env.AUTH_ENABLED = authEnabled;
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.API_DELAY_ENABLED = 'false';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const nestApp = moduleFixture.createNestApplication();
    nestApp.use(cookieParser());
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
  ): Promise<{ accessCookie: string; refreshCookie: string }> => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const setCookieHeader = response.headers['set-cookie'];
    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader
        ? [setCookieHeader]
        : [];
    const accessCookie = cookies.find((cookie: string) =>
      cookie.startsWith(`${ACCESS_TOKEN_COOKIE_NAME}=`),
    );
    const refreshCookie = cookies.find((cookie: string) =>
      cookie.startsWith(`${REFRESH_TOKEN_COOKIE_NAME}=`),
    );

    if (!accessCookie || !refreshCookie) {
      throw new Error('Authentication cookies were not returned by /auth/login');
    }

    return {
      accessCookie: accessCookie.split(';')[0],
      refreshCookie: refreshCookie.split(';')[0],
    };
  };

  beforeAll(async () => {
    app = await createApp('true');
    const adminSession = await login('admin@example.com', 'admin123');
    const userSession = await login('user@example.com', 'user123');

    adminAccessCookie = adminSession.accessCookie;
    adminRefreshCookie = adminSession.refreshCookie;
    userAccessCookie = userSession.accessCookie;
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
    expect(response.body.access_token).toBeUndefined();
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining(`${ACCESS_TOKEN_COOKIE_NAME}=`),
        expect.stringContaining(`${REFRESH_TOKEN_COOKIE_NAME}=`),
      ]),
    );
  });

  it('returns the canonical authenticated user profile with auth enabled', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', adminAccessCookie)
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

  it('rotates access and refresh cookies through the refresh endpoint', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [adminAccessCookie, adminRefreshCookie])
      .expect(200);

    const setCookieHeader = response.headers['set-cookie'];
    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader
        ? [setCookieHeader]
        : [];
    const rotatedAccessCookie = cookies.find((cookie: string) =>
      cookie.startsWith(`${ACCESS_TOKEN_COOKIE_NAME}=`),
    );
    const rotatedRefreshCookie = cookies.find((cookie: string) =>
      cookie.startsWith(`${REFRESH_TOKEN_COOKIE_NAME}=`),
    );

    expect(rotatedAccessCookie).toBeDefined();
    expect(rotatedRefreshCookie).toBeDefined();
    expect(rotatedAccessCookie?.split(';')[0]).not.toBe(adminAccessCookie);
    expect(rotatedRefreshCookie?.split(';')[0]).not.toBe(adminRefreshCookie);
    expect(response.body.user.email).toBe('admin@example.com');

    adminAccessCookie = rotatedAccessCookie!.split(';')[0];
    adminRefreshCookie = rotatedRefreshCookie!.split(';')[0];
  });

  it('rejects stale refresh tokens after rotation', async () => {
    const previousSession = await login('user@example.com', 'user123');
    const refreshed = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [previousSession.accessCookie, previousSession.refreshCookie])
      .expect(200);

    const refreshedSetCookieHeader = refreshed.headers['set-cookie'];
    const refreshedCookies = Array.isArray(refreshedSetCookieHeader)
      ? refreshedSetCookieHeader
      : refreshedSetCookieHeader
        ? [refreshedSetCookieHeader]
        : [];
    const rotatedRefreshCookie = refreshedCookies.find((cookie: string) =>
      cookie.startsWith(`${REFRESH_TOKEN_COOKIE_NAME}=`),
    )!;

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [previousSession.accessCookie, previousSession.refreshCookie])
      .expect(401);

  });

  it('protects the seed endpoint and exposes it only as POST', async () => {
    process.env.AUTH_ENABLED = 'true';

    await request(app.getHttpServer()).get('/seed').expect(404);

    await request(app.getHttpServer())
      .post('/seed')
      .set('Cookie', userAccessCookie)
      .expect(403);

    const response = await request(app.getHttpServer())
      .post('/seed')
      .set('Cookie', adminAccessCookie)
      .expect(200);

    expect(response.body).toEqual({
      message: 'Catalog dataset loaded successfully',
    });
  });

  it('filters and sorts only by list-visible fields', async () => {
    await request(app.getHttpServer())
      .post('/cars')
      .set('Cookie', adminAccessCookie)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-3', 'model-11'))
      .expect(201);

    await request(app.getHttpServer())
      .post('/cars')
      .set('Cookie', adminAccessCookie)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-1', 'model-2'))
      .expect(201);

    const filteredResults = await request(app.getHttpServer())
      .get('/cars')
      .set('Cookie', adminAccessCookie)
      .query({ brandId: 'brand-3', modelId: 'model-11' })
      .expect(200);

    expect(filteredResults.body.meta.itemCount).toBe(1);
    expect(filteredResults.body.items[0].brand.id).toBe('brand-3');
    expect(filteredResults.body.items[0].model.id).toBe('model-11');

    const sortedResults = await request(app.getHttpServer())
      .get('/cars')
      .set('Cookie', adminAccessCookie)
      .query({ sortBy: 'brand', sortOrder: 'asc' })
      .expect(200);

    expect(sortedResults.body.items.length).toBeGreaterThan(1);
    expect(sortedResults.body.items[0].brand.name.localeCompare(sortedResults.body.items[1].brand.name, 'es', { sensitivity: 'base' })).toBeLessThanOrEqual(0);

    const invalidSortResponse = await request(app.getHttpServer())
      .get('/cars')
      .set('Cookie', adminAccessCookie)
      .query({ sortBy: 'price' })
      .expect(400);

    expect(JSON.stringify(invalidSortResponse.body.message)).toContain(
      'sortBy must be one of the following values: brand, model, total',
    );
  });

  it('allows keeping the same license plate on update and rejects duplicates from another car', async () => {
    const originalPlate = uniquePlate();
    const duplicatePlate = uniquePlate();

    const firstCarResponse = await request(app.getHttpServer())
      .post('/cars')
      .set('Cookie', adminAccessCookie)
      .send(
        createCarPayloadForBrandModel(originalPlate, 'brand-4', 'model-14'),
      )
      .expect(201);

    await request(app.getHttpServer())
      .post('/cars')
      .set('Cookie', adminAccessCookie)
      .send(
        createCarPayloadForBrandModel(duplicatePlate, 'brand-5', 'model-16'),
      )
      .expect(201);

    const updatedWithSamePlate = await request(app.getHttpServer())
      .put(`/cars/${firstCarResponse.body.id}`)
      .set('Cookie', adminAccessCookie)
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
      .set('Cookie', adminAccessCookie)
      .send(
        createCarPayloadForBrandModel(duplicatePlate, 'brand-4', 'model-14'),
      )
      .expect(409);

    expect(duplicateUpdateResponse.body.code).toBe('CAR_DUPLICATE_LICENSE_PLATE');
    expect(duplicateUpdateResponse.body.message).toContain(
      'already registered to another car',
    );
  });

  it('rejects duplicated brand/model combinations on create and update', async () => {
    const firstCarResponse = await request(app.getHttpServer())
      .post('/cars')
      .set('Cookie', adminAccessCookie)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-2', 'model-6'))
      .expect(201);

    const secondCarResponse = await request(app.getHttpServer())
      .post('/cars')
      .set('Cookie', adminAccessCookie)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-2', 'model-7'))
      .expect(201);

    const duplicateCreateResponse = await request(app.getHttpServer())
      .post('/cars')
      .set('Cookie', adminAccessCookie)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-2', 'model-6'))
      .expect(409);

    expect(duplicateCreateResponse.body.code).toBe('CAR_DUPLICATE_BRAND_MODEL');
    expect(duplicateCreateResponse.body.message).toContain(
      'Only one car per brand and model is allowed',
    );

    const duplicateUpdateResponse = await request(app.getHttpServer())
      .put(`/cars/${secondCarResponse.body.id}`)
      .set('Cookie', adminAccessCookie)
      .send(createCarPayloadForBrandModel(uniquePlate(), 'brand-2', 'model-6'))
      .expect(409);

    expect(duplicateUpdateResponse.body.code).toBe('CAR_DUPLICATE_BRAND_MODEL');
    expect(duplicateUpdateResponse.body.message).toContain(
      'Only one car per brand and model is allowed',
    );

    const unchangedUpdateResponse = await request(app.getHttpServer())
      .put(`/cars/${firstCarResponse.body.id}`)
      .set('Cookie', adminAccessCookie)
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
      .set('Cookie', adminAccessCookie)
      .send(
        createCarPayloadForBrandModel(uniquePlate(), 'brand-4', 'model-15'),
      )
      .expect(201);

    const carId = carResponse.body.id;

    await request(app.getHttpServer())
      .post(`/cars/${carId}/document`)
      .set('Cookie', adminAccessCookie)
      .field('title', 'Missing file')
      .expect(400);

    await request(app.getHttpServer())
      .post(`/cars/${carId}/document`)
      .set('Cookie', adminAccessCookie)
      .attach('file', Buffer.from('zip-content'), {
        filename: 'document.zip',
        contentType: 'application/zip',
      })
      .expect(415);

    await request(app.getHttpServer())
      .post(`/cars/${carId}/document`)
      .set('Cookie', adminAccessCookie)
      .attach('file', Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: 'large.pdf',
        contentType: 'application/pdf',
      })
      .expect(413);

    await request(app.getHttpServer())
      .post(`/cars/${carId}/document`)
      .set('Cookie', adminAccessCookie)
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
      .get(`/cars/${carId}/document`)
      .set('Cookie', adminAccessCookie)
      .expect(404);

    await request(app.getHttpServer())
      .get(`/cars/${carId}/document/download`)
      .set('Cookie', adminAccessCookie)
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/cars/${carId}/document`)
      .set('Cookie', adminAccessCookie)
      .expect(404);
  });

  it('returns 404 for unknown brands when requesting models', async () => {
    await request(app.getHttpServer())
      .get('/brands/brand-999/models')
      .set('Cookie', adminAccessCookie)
      .expect(404);
  });

  it('clears both session cookies on logout', async () => {
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', [adminAccessCookie, adminRefreshCookie])
      .expect(204)
      .expect('set-cookie', new RegExp(`${ACCESS_TOKEN_COOKIE_NAME}=;`));

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=`)
      .expect(401);

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', `${REFRESH_TOKEN_COOKIE_NAME}=`)
      .expect(401);

    const adminSession = await login('admin@example.com', 'admin123');
    adminAccessCookie = adminSession.accessCookie;
    adminRefreshCookie = adminSession.refreshCookie;
  });

  it('generates Swagger with the corrected security and response schemas', async () => {
    const swaggerDocument = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Test API')
        .setVersion('1.0')
        .addCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
        .addCookieAuth(REFRESH_TOKEN_COOKIE_NAME)
        .build(),
    );

    expect(swaggerDocument.paths['/auth/login'].post.security).toBeUndefined();
    expect(swaggerDocument.paths['/auth/logout'].post.security).toBeUndefined();
    expect(swaggerDocument.paths['/auth/refresh'].post.security).toEqual([
      { refresh_token: [] },
    ]);
    expect(swaggerDocument.paths['/auth/me'].get.security).toEqual([
      { access_token: [] },
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
