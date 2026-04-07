import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Res,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilterCallback, memoryStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserRole } from '../auth/auth.service';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { MulterExceptionFilter } from './filters/multer-exception.filter';
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  CarDocumentFileValidationPipe,
  MAX_DOCUMENT_FILE_SIZE,
} from './pipes/car-document-file-validation.pipe';
import { CarsService } from './cars.service';
import {
  CreateCarDto,
  UploadCarDocumentDto,
  UploadedCarDocumentResponseDto,
  UploadedPracticeFile,
} from './dto';
import { GetCarsFilterDto } from './dto/get-cars-filter.dto';
import { Car, CarSummary } from './entities';

@ApiTags('Vehicles')
@ApiBearerAuth()
@ApiExtraModels(PaginatedResponseDto, CarSummary)
@Controller('cars')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({
    summary: 'List vehicles with pagination, filters and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle catalog returned successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(CarSummary) },
            },
          },
        },
      ],
    },
  })
  getAllCars(
    @Query() filterDto: GetCarsFilterDto,
  ): PaginatedResponseDto<CarSummary> {
    return this.carsService.findAll(filterDto);
  }

  @Get('export/excel')
  @ApiOperation({
    summary: 'Export the filtered vehicle table to a real Excel file',
  })
  @ApiProduces(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @ApiResponse({
    status: 200,
    description: 'Excel file generated successfully',
  })
  async exportCarsToExcel(
    @Query() filterDto: GetCarsFilterDto,
    @Res() response: Response,
  ): Promise<void> {
    const file = await this.carsService.exportCarsToExcel(filterDto);
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.fileName}"`,
    );
    response.send(file.content);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a vehicle by identifier' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle identifier' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle returned successfully',
    type: Car,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  getCarById(@Param('id', ParseUUIDPipe) id: string): Car {
    return this.carsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new vehicle entry (ADMIN only)' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle created successfully',
    type: Car,
  })
  @ApiResponse({ status: 400, description: 'Invalid vehicle payload' })
  @ApiResponse({
    status: 409,
    description:
      'Vehicle conflicts with an existing license plate or brand/model combination',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createCar(@Body() createCarDto: CreateCarDto): Car {
    return this.carsService.create(createCarDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an existing vehicle entry (ADMIN only)' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle identifier' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle updated successfully',
    type: Car,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid vehicle payload. PUT expects the full CreateCarDto contract.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Vehicle conflicts with an existing license plate or brand/model combination',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateCar(
    @Body() carToUpdate: CreateCarDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Car {
    return this.carsService.update(id, carToUpdate);
  }

  @Get(':id/document')
  @ApiOperation({
    summary: 'Retrieve metadata for the single document linked to a vehicle',
  })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle identifier' })
  @ApiResponse({
    status: 200,
    description: 'Document metadata returned successfully',
    type: UploadedCarDocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vehicle or document not found' })
  getCarDocumentMetadata(
    @Param('id', ParseUUIDPipe) id: string,
  ): UploadedCarDocumentResponseDto {
    return this.carsService.getDocumentMetadata(id);
  }

  @Get(':id/document/download')
  @ApiOperation({
    summary: 'Download the single document linked to a vehicle',
  })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle identifier' })
  @ApiResponse({
    status: 200,
    description: 'Document download started successfully',
  })
  @ApiResponse({ status: 404, description: 'Vehicle or document not found' })
  downloadCarDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() response: Response,
  ): void {
    const document = this.carsService.getDocumentForDownload(id);
    response.download(document.storagePath, document.originalName);
  }

  @Delete(':id/document')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete the single document linked to a vehicle (ADMIN only)',
  })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle identifier' })
  @ApiResponse({ status: 204, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle or document not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  deleteCarDocument(@Param('id', ParseUUIDPipe) id: string): void {
    this.carsService.removeDocument(id);
  }

  @Post(':id/document')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_DOCUMENT_FILE_SIZE,
      },
      fileFilter: (
        _request: Request,
        file: { mimetype: string },
        callback: FileFilterCallback,
      ) => {
        if (!ALLOWED_DOCUMENT_MIME_TYPES.has(file.mimetype)) {
          callback(
            new UnsupportedMediaTypeException(
              `Unsupported file type "${file.mimetype}".`,
            ),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  @UseFilters(MulterExceptionFilter)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Upload or replace the single stored document for a vehicle (ADMIN only)',
  })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle identifier' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Ficha tecnica ITV' },
        documentType: {
          type: 'string',
          enum: ['invoice', 'inspection', 'insurance', 'registration', 'other'],
          example: 'inspection',
        },
        description: {
          type: 'string',
          example: 'Documento de prueba para practicar subida con FormData',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document stored successfully',
    type: UploadedCarDocumentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid multipart payload or missing file',
  })
  @ApiResponse({
    status: 413,
    description: 'Uploaded file exceeds the 5 MB limit',
  })
  @ApiResponse({
    status: 415,
    description: 'Unsupported file type',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  uploadCarDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() uploadDocumentDto: UploadCarDocumentDto,
    @UploadedFile(new CarDocumentFileValidationPipe())
    file: UploadedPracticeFile,
  ): UploadedCarDocumentResponseDto {
    return this.carsService.uploadDocument(id, uploadDocumentDto, file);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a vehicle entry (ADMIN only)' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle identifier' })
  @ApiResponse({ status: 204, description: 'Vehicle deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  deleteCar(@Param('id', ParseUUIDPipe) id: string): void {
    this.carsService.remove(id);
  }
}
