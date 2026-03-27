import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Brand, Model } from './data/brand.data';

@ApiTags('Catalog')
@ApiBearerAuth()
@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'List available vehicle brands' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle brand catalog returned successfully',
    type: [Object],
  })
  getAllBrands(): Brand[] {
    return this.brandsService.getAllBrands();
  }

  @Get(':brandId/models')
  @ApiOperation({ summary: 'List models for a specific brand' })
  @ApiResponse({
    status: 200,
    description: 'Model catalog for the requested brand returned successfully',
    type: [Object],
  })
  getModelsByBrand(@Param('brandId') brandId: string): Model[] {
    return this.brandsService.getModelsByBrand(brandId);
  }
}
