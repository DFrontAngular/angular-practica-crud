import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { SeedModule } from './seed/seed.module';
import { BrandsModule } from './brands/brands.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CarsModule,
    SeedModule,
    BrandsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
