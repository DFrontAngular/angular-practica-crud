import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
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

export class GetCarsFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description:
      'Filter results by a partial license plate match, ignoring spaces and case',
    example: '1234',
  })
  @IsString()
  @IsOptional()
  licensePlate?: string;

  @ApiPropertyOptional({
    description: 'Filter results by availability status',
    example: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'boolean' || value === undefined) {
      return value;
    }

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean({ message: 'available must be either true or false' })
  @IsOptional()
  available?: boolean;

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
