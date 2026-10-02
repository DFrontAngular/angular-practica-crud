import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export const CAR_SORT_FIELDS = [
  'brand',
  'model',
  'total',
] as const;

export type CarSortField = (typeof CAR_SORT_FIELDS)[number];
export type SortOrder = 'asc' | 'desc';

export class GetCarsFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description:
      'Free-text search across brand name, model name, and license plate. The match is case-insensitive and accent-insensitive.',
    example: 'Corolla',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter results to a single brand by exact brand identifier',
    example: 'brand-1',
  })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiPropertyOptional({
    description:
      'Field used to sort the vehicle list. Only list-visible fields are exposed here.',
    enum: CAR_SORT_FIELDS,
    example: 'brand',
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
