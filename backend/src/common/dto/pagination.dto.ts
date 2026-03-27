import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number to retrieve (1-indexed)',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items to return per page',
    minimum: 1,
    default: 10,
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}

export class PaginatedMetaDto {
  @ApiProperty({ description: 'Total number of items matching the query (across all pages)', example: 50 })
  totalItems: number;

  @ApiProperty({ description: 'Number of items returned in the current page', example: 10 })
  itemCount: number;

  @ApiProperty({ description: 'Maximum items per page as requested', example: 10 })
  itemsPerPage: number;

  @ApiProperty({ description: 'Total number of pages given the current limit', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'Current page number (1-indexed)', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'True if there is a page after the current one', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'True if there is a page before the current one', example: false })
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true, description: 'Array of items for the current page' })
  items: T[];

  @ApiProperty({ type: PaginatedMetaDto, description: 'Pagination metadata' })
  meta: PaginatedMetaDto;
}
