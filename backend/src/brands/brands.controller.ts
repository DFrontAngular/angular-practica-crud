import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Brand, Model } from './data/brand.data';

@ApiTags('brands')
@ApiBearerAuth()
@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all car brands' })
  @ApiResponse({
    status: 200,
    description: 'List of car brands',
    type: [Object],
  })
  getAllBrands(): Brand[] {
    return this.brandsService.getAllBrands();
  }

  @Get(':brandId/models')
  @ApiOperation({ summary: 'Get models by car brand' })
  @ApiResponse({
    status: 200,
    description: 'List of models for the specified brand',
    type: [Object],
  })
  getModelsByBrand(@Param('brandId') brandId: string): Model[] {
    return this.brandsService.getModelsByBrand(brandId);
  }
}
