import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CarDetailsDto, CreateCarDto } from '../dto';

/**
 * Extends CarDetailsDto with the imageUrl that the backend resolves
 * automatically (never provided by the client in the request body).
 */
export class CarDetailEntity extends CarDetailsDto {
  @ApiProperty({
    description: 'Vehicle image URL resolved by the backend',
    type: String,
    example: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    readOnly: true,
  })
  imageUrl: string;
}

export class Car extends OmitType(CreateCarDto, ['carDetails'] as const) {
  @ApiProperty({ description: 'Vehicle identifier', type: String })
  id: string;

  @ApiProperty({
    description: 'Vehicle detail entries',
    type: [CarDetailEntity],
    required: false,
  })
  carDetails?: CarDetailEntity[];

  @ApiProperty({
    description: 'Total number of vehicle detail entries',
    type: Number,
    required: false,
  })
  total?: number;
}

export class CarSummary extends OmitType(Car, ['carDetails'] as const) {
  @ApiProperty({
    description: 'Representative vehicle image URL for list and card views',
    type: String,
    required: false,
    example: '/images/car_images/model-1_toyota_corolla.webp',
  })
  imageUrl?: string;
}
