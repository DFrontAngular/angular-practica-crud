import { ApiProperty } from '@nestjs/swagger';

export class Brand {
  @ApiProperty({ description: 'Brand identifier', example: 'brand-1' })
  id: string;

  @ApiProperty({ description: 'Display name of the brand', example: 'Toyota' })
  name: string;
}

export class Model {
  @ApiProperty({ description: 'Model identifier', example: 'model-1' })
  id: string;

  @ApiProperty({ description: 'Display name of the model', example: 'Corolla' })
  name: string;

  @ApiProperty({
    description: 'Identifier of the brand this model belongs to',
    example: 'brand-1',
  })
  brandId: string;
}

export const brandsDB: Brand[] = [
  { id: 'brand-1', name: 'Toyota' },
  { id: 'brand-2', name: 'Ford' },
  { id: 'brand-3', name: 'Honda' },
  { id: 'brand-4', name: 'BMW' },
  { id: 'brand-5', name: 'Mercedes-Benz' },
  { id: 'brand-6', name: 'Chevrolet' },
  { id: 'brand-7', name: 'Nissan' },
  { id: 'brand-8', name: 'Audi' },
  { id: 'brand-9', name: 'Hyundai' },
  { id: 'brand-10', name: 'Kia' },
];

export const modelsDB: Model[] = [
  // Toyota
  { id: 'model-1', name: 'Corolla', brandId: 'brand-1' },
  { id: 'model-2', name: 'Camry', brandId: 'brand-1' },
  { id: 'model-3', name: 'Prius', brandId: 'brand-1' },
  { id: 'model-4', name: 'RAV4', brandId: 'brand-1' },
  { id: 'model-5', name: 'Land Cruiser', brandId: 'brand-1' },
  // Ford
  { id: 'model-6', name: 'Focus', brandId: 'brand-2' },
  { id: 'model-7', name: 'Mustang', brandId: 'brand-2' },
  { id: 'model-8', name: 'Escape', brandId: 'brand-2' },
  { id: 'model-9', name: 'Explorer', brandId: 'brand-2' },
  { id: 'model-10', name: 'F-150', brandId: 'brand-2' },
  // Honda
  { id: 'model-11', name: 'Civic', brandId: 'brand-3' },
  { id: 'model-12', name: 'Accord', brandId: 'brand-3' },
  { id: 'model-13', name: 'CR-V', brandId: 'brand-3' },
  // BMW
  { id: 'model-14', name: 'X5', brandId: 'brand-4' },
  { id: 'model-15', name: 'M3', brandId: 'brand-4' },
  // Mercedes
  { id: 'model-16', name: 'C Class', brandId: 'brand-5' },
  { id: 'model-17', name: 'E Class', brandId: 'brand-5' },
  // Chevrolet
  { id: 'model-18', name: 'Camaro', brandId: 'brand-6' },
  { id: 'model-19', name: 'Silverado', brandId: 'brand-6' },
  // Nissan
  { id: 'model-20', name: 'Altima', brandId: 'brand-7' },
  { id: 'model-21', name: 'Z', brandId: 'brand-7' },
  // Audi
  { id: 'model-22', name: 'A4', brandId: 'brand-8' },
  { id: 'model-23', name: 'Q5', brandId: 'brand-8' },
  // Hyundai
  { id: 'model-24', name: 'Tucson', brandId: 'brand-9' },
  { id: 'model-25', name: 'Ioniq 5', brandId: 'brand-9' },
  // Kia
  { id: 'model-26', name: 'Sportage', brandId: 'brand-10' },
  { id: 'model-27', name: 'EV6', brandId: 'brand-10' },
];
