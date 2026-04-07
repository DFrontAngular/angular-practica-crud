import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE_NAME } from '../auth/auth.constants';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Brand, Model } from './data/brand.data';

@ApiTags('Catalog')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'List available vehicle brands' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle brand catalog returned successfully',
    type: [Brand],
  })
  getAllBrands(): Brand[] {
    return this.brandsService.getAllBrands();
  }

  @Get(':brandId/models')
  @ApiOperation({ summary: 'List models for a specific brand' })
  @ApiParam({
    name: 'brandId',
    type: String,
    description: 'Brand identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Model catalog for the requested brand returned successfully',
    type: [Model],
  })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  getModelsByBrand(@Param('brandId') brandId: string): Model[] {
    return this.brandsService.getModelsByBrand(brandId);
  }
}
