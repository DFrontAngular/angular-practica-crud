import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UserRole } from '../auth/auth.service';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
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
    type: PaginatedResponseDto,
  })
  getAllCars(
    @Query() filterDto: GetCarsFilterDto,
  ): PaginatedResponseDto<CarSummary> {
    return this.carsService.findAll(filterDto);
  }

  @Get('export/excel')
  @ApiOperation({
    summary: 'Export the filtered vehicle table to an Excel-compatible file',
  })
  @ApiProduces('application/vnd.ms-excel')
  @ApiResponse({
    status: 200,
    description: 'Excel-compatible file generated successfully',
  })
  exportCarsToExcel(
    @Query() filterDto: GetCarsFilterDto,
    @Res() response: Response,
  ): void {
    const file = this.carsService.exportCarsToExcel(filterDto);
    response.setHeader(
      'Content-Type',
      'application/vnd.ms-excel; charset=utf-8',
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
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateCar(
    @Body() carToUpdate: CreateCarDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Car {
    return this.carsService.update(id, carToUpdate);
  }

  @Post(':id/documents')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a practice document for a vehicle (ADMIN only)',
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
    description: 'Document received successfully and processed in memory',
    type: UploadedCarDocumentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid multipart payload or unsupported file type',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  uploadCarDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() uploadDocumentDto: UploadCarDocumentDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .addFileTypeValidator({
          fileType:
            /^(application\/pdf|text\/plain|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|image\/png|image\/jpeg)$/,
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: 400,
        }),
    )
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
