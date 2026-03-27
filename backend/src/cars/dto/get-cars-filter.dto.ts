import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export const CAR_SORT_FIELDS = [
  'brandId',
  'modelId',
  'total',
  'price',
  'manufactureYear',
  'registrationDate',
  'mileage',
  'licensePlate',
  'availability',
] as const;

export type CarSortField = (typeof CAR_SORT_FIELDS)[number];
export type SortOrder = 'asc' | 'desc';
const CURRENT_YEAR = new Date().getFullYear();

function transformBooleanQueryValue(value: unknown): unknown {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();
    if (normalizedValue === 'true') {
      return true;
    }
    if (normalizedValue === 'false') {
      return false;
    }
  }

  return value;
}

export class GetCarsFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter results to a single brand by exact brand identifier',
    example: 'brand-1',
  })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiPropertyOptional({
    description:
      'Filter results to a single model by exact model identifier. Typically combined with brandId.',
    example: 'model-1',
  })
  @IsString()
  @IsOptional()
  modelId?: string;

  @ApiPropertyOptional({
    description:
      'Return only vehicles whose price is greater than or equal to this value',
    minimum: 0,
    example: 10000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({
    description:
      'Return only vehicles whose price is lower than or equal to this value',
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
    maximum: CURRENT_YEAR,
    example: 2024,
  })
  @Type(() => Number)
  @IsNumber()
  @Max(CURRENT_YEAR)
  @IsOptional()
  maxYear?: number;

  @ApiPropertyOptional({
    description:
      'When true, returns only available vehicles. When false, returns only unavailable ones.',
    example: true,
  })
  @Transform(({ value }) => transformBooleanQueryValue(value))
  @IsBoolean({ message: 'available must be either true or false' })
  @IsOptional()
  available?: boolean;

  @ApiPropertyOptional({
    description: 'Partial, case-insensitive search on the license plate field',
    example: '1234',
  })
  @IsString()
  @IsOptional()
  licensePlate?: string;

  @ApiPropertyOptional({
    description: 'Field used to sort the vehicle list',
    enum: CAR_SORT_FIELDS,
    example: 'price',
  })
  @IsString()
  @IsIn(CAR_SORT_FIELDS)
  @IsOptional()
  sortBy?: CarSortField;

  @ApiPropertyOptional({
    description: 'Sort direction applied to sortBy',
    enum: ['asc', 'desc'],
    default: 'asc',
    example: 'asc',
  })
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: SortOrder = 'asc';
}
