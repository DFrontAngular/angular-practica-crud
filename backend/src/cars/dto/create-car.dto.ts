import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ISO_CURRENCIES_CODE } from '../data/iso-currencies.data';
import { IsBrandValid } from '../validators/brand-exists.validator';
import { IsModelValid } from '../validators/model-exists.validator';
import { IsBeforeField } from '../validators/is-before-field.validator';
import { IsUniqueLicensePlate } from '../validators/unique-license-plate.validator';

const licensePlateRegex = /^[0-9]{4}\s?[BCDFGHJKLMNPRSTVWXYZ]{3}$/;
const registrationDateRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/;

export class CarDetailsDto {
  @ApiProperty({
    description: 'Official registration date of the car (ISO 8601 UTC format)',
    type: String,
    example: '2024-10-30T10:01:35.288Z',
    pattern: 'YYYY-MM-DDTHH:MM:SS.mmmZ',
  })
  @IsDateString({ strictSeparator: true, strict: true })
  @IsNotEmpty()
  @Matches(registrationDateRegex, {
    message: 'Registration date must be in the format YYYY-MM-DDTHH:MM:SS.mmmZ',
  })
  registrationDate: string;

  @ApiProperty({
    description: 'Current mileage of the car in kilometres',
    type: Number,
    example: 15000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  mileage: number;

  @ApiProperty({
    description:
      'Currency of the price as an ISO 4217 code. Defaults to EUR when not provided.',
    enum: ISO_CURRENCIES_CODE,
    example: 'EUR',
    required: false,
    default: 'EUR',
  })
  @IsString()
  @IsOptional()
  @IsIn(ISO_CURRENCIES_CODE, {
    message: `Currency must be a valid ISO 4217 code from the supported list`,
  })
  currency?: string;

  @ApiProperty({
    description: 'Asking price of the car (must be a positive number)',
    type: Number,
    example: 20000,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: `Year the car was manufactured. Must be between 1900 and the current year (${new Date().getFullYear()}).
Also must be ≤ the year in registrationDate.`,
    type: Number,
    example: 2020,
    minimum: 1900,
    maximum: new Date().getFullYear(),
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1900, { message: 'Manufacture year must be greater than or equal to 1900' })
  @Max(new Date().getFullYear(), {
    message: `Manufacture year cannot be greater than the current year`,
  })
  @IsBeforeField('registrationDate')
  manufactureYear: number;

  @ApiProperty({
    description:
      'Whether the car is currently available for sale. Defaults to true when not provided.',
    type: Boolean,
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @ApiProperty({
    description: 'Exterior colour of the car',
    type: String,
    example: 'Midnight Blue',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'Free-text description highlighting condition, extras, or any relevant details',
    type: String,
    example: 'Excellent condition, single owner, full service history.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description:
      'Spanish license plate. Format: 4 digits + optional space + 3 consonants (e.g. 1234 ABC). Must be unique across all cars.',
    type: String,
    example: '1234 ABC',
    pattern: '^[0-9]{4}\\s?[BCDFGHJKLMNPRSTVWXYZ]{3}$',
  })
  @IsString()
  @Matches(licensePlateRegex, {
    message: 'Car license plate must be a valid Spanish license plate, e.g. 1234 ABC.',
  })
  @IsNotEmpty()
  @IsUniqueLicensePlate()
  readonly licensePlate: string;
}

export class CreateCarDto {
  @ApiProperty({
    description:
      'ID of the car brand. Must reference an existing brand (e.g. brand-1, brand-2).',
    type: String,
    example: 'brand-1',
  })
  @IsString()
  @IsNotEmpty()
  @IsBrandValid()
  readonly brandId: string;

  @ApiProperty({
    description:
      'ID of the car model. Must reference a model that belongs to the selected brand.',
    type: String,
    example: 'model-1',
  })
  @IsString()
  @IsNotEmpty()
  @IsModelValid()
  readonly modelId: string;

  @ApiProperty({
    description:
      'List of car detail entries (one per listing or unit). Can be omitted to create a car without details.',
    type: [CarDetailsDto],
    required: false,
    example: [
      {
        registrationDate: '2024-10-30T10:01:35.288Z',
        mileage: 15000,
        price: 20000,
        manufactureYear: 2020,
        currency: 'EUR',
        availability: true,
        color: 'Midnight Blue',
        description: 'Excellent condition, single owner.',
        licensePlate: '1234 ABC',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarDetailsDto)
  @IsOptional()
  readonly carDetails?: CarDetailsDto[];
}
