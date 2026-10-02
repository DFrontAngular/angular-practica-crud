import { PartialType } from '@nestjs/swagger';
import { CreateCarDto } from './create-car.dto';

/**
 * @deprecated Use CreateCarDto
 */
export class UpdateCarDto extends PartialType(CreateCarDto) {}
