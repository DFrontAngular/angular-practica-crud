import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { SeedModule } from './seed/seed.module';
import { BrandsModule } from './brands/brands.module';
import { SimulatedLatencyInterceptor } from './common/interceptors/simulated-latency.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CarsModule,
    SeedModule,
    BrandsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SimulatedLatencyInterceptor,
    },
  ],
  exports: [],
})
export class AppModule {}
