import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CarDetailsDto, CreateCarDto } from '../dto';

/**
 * Extends CarDetailsDto with the imageUrl that the backend resolves
 * automatically (never provided by the client in the request body).
 */
export class CarDetailEntity extends CarDetailsDto {
  @ApiProperty({
    description:
      'Car image URL resolved by the backend (random Unsplash photo)',
    type: String,
    example: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    readOnly: true,
  })
  imageUrl: string;
}

export class Car extends OmitType(CreateCarDto, ['carDetails'] as const) {
  @ApiProperty({ description: 'Car ID', type: String })
  id: string;

  @ApiProperty({
    description: 'Car details entries',
    type: [CarDetailEntity],
    required: false,
  })
  carDetails?: CarDetailEntity[];

  @ApiProperty({
    description: 'Total number of car detail entries',
    type: Number,
    required: false,
  })
  total?: number;
}

export class CarSummary extends OmitType(Car, ['carDetails'] as const) {}
