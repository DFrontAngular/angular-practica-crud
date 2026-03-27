import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export const CAR_DOCUMENT_TYPES = [
  'invoice',
  'inspection',
  'insurance',
  'registration',
  'other',
] as const;

export type CarDocumentType = (typeof CAR_DOCUMENT_TYPES)[number];

export interface UploadedPracticeFile {
  originalname: string;
  mimetype: string;
  size: number;
}

export class UploadCarDocumentDto {
  @ApiPropertyOptional({
    description: 'Optional display title for the uploaded document',
    example: 'Ficha tecnica ITV',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Functional category of the uploaded document',
    enum: CAR_DOCUMENT_TYPES,
    default: 'other',
    example: 'inspection',
  })
  @IsString()
  @IsIn(CAR_DOCUMENT_TYPES)
  @IsOptional()
  documentType?: CarDocumentType = 'other';

  @ApiPropertyOptional({
    description: 'Optional notes attached to the uploaded document',
    example: 'Documento de prueba para practicar subida con FormData',
    maxLength: 300,
  })
  @IsString()
  @MaxLength(300)
  @IsOptional()
  description?: string;
}

export class UploadedCarDocumentResponseDto {
  @ApiProperty({
    description: 'Generated identifier for the uploaded document metadata',
    example: 'a3f7d1e3-5c7e-4a50-8b84-df73b46e5d4f',
  })
  id: string;

  @ApiProperty({
    description: 'Vehicle identifier the upload was associated with',
    example: '9f65ec7a-ef2c-4d8a-a7dc-248018fca712',
  })
  carId: string;

  @ApiProperty({
    description: 'Original filename received in the multipart upload',
    example: 'itv.pdf',
  })
  originalName: string;

  @ApiProperty({
    description: 'MIME type reported for the uploaded file',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 184532,
  })
  size: number;

  @ApiProperty({
    description: 'Functional category assigned to the document',
    enum: CAR_DOCUMENT_TYPES,
    example: 'inspection',
  })
  documentType: CarDocumentType;

  @ApiPropertyOptional({
    description: 'Optional display title for the document',
    example: 'Ficha tecnica ITV',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Optional notes attached to the document',
    example: 'Documento de prueba para practicar subida con FormData',
  })
  description?: string;

  @ApiProperty({
    description: 'Timestamp when the upload was received',
    example: '2026-03-27T10:15:00.000Z',
  })
  uploadedAt: string;

  @ApiProperty({
    description: 'Indicates whether the backend persisted the binary content',
    example: false,
  })
  persisted: boolean;

  @ApiProperty({
    description: 'Explains how the practice upload is handled in this training backend',
    example: 'The file was received as multipart/form-data and processed in memory, but it was not stored.',
  })
  message: string;
}
