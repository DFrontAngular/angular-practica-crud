import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class GetCarsFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter results to a single brand by exact brand identifier',
    example: 'brand-1',
  })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiPropertyOptional({
    description: 'Filter results to a single model by exact model identifier. Typically combined with brandId.',
    example: 'model-1',
  })
  @IsString()
  @IsOptional()
  modelId?: string;

  @ApiPropertyOptional({
    description: 'Return only vehicles whose price is greater than or equal to this value',
    minimum: 0,
    example: 10000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Return only vehicles whose price is lower than or equal to this value',
    minimum: 0,
    example: 40000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Return only vehicles manufactured in or after this year',
    minimum: 1900,
    example: 2018,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  @IsOptional()
  minYear?: number;

  @ApiPropertyOptional({
    description: 'Return only vehicles manufactured in or before this year',
    maximum: new Date().getFullYear(),
    example: 2024,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxYear?: number;

  @ApiPropertyOptional({
    description: 'When true, returns only available vehicles. When false, returns only unavailable ones.',
    example: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiPropertyOptional({
    description: 'Partial, case-insensitive search on the license plate field',
    example: '1234',
  })
  @IsString()
  @IsOptional()
  licensePlate?: string;
}
