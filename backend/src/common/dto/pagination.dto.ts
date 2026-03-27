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
    description: 'Maximum number of items to return per page',
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
  @ApiProperty({
    description: 'Total number of records matching the current query',
    example: 50,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Number of records returned in the current page',
    example: 10,
  })
  itemCount: number;

  @ApiProperty({
    description: 'Maximum records per page requested by the client',
    example: 10,
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Total number of pages for the current query and limit',
    example: 5,
  })
  totalPages: number;

  @ApiProperty({ description: 'Current page number (1-indexed)', example: 1 })
  currentPage: number;

  @ApiProperty({
    description: 'Indicates whether another page exists after the current one',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Indicates whether a page exists before the current one',
    example: false,
  })
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    isArray: true,
    description: 'Collection of records returned for the current page',
  })
  items: T[];

  @ApiProperty({
    type: PaginatedMetaDto,
    description: 'Pagination metadata for the current query',
  })
  meta: PaginatedMetaDto;
}
