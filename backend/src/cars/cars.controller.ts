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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../auth/auth.service';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto';
import { Car, CarSummary } from './entities';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { GetCarsFilterDto } from './dto/get-cars-filter.dto';

@ApiTags('Vehicles')
@ApiBearerAuth()
@Controller('cars')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'List vehicles with pagination, filters and sorting' })
  @ApiResponse({ status: 200, description: 'Vehicle catalog returned successfully', type: PaginatedResponseDto })
  getAllCars(@Query() filterDto: GetCarsFilterDto): PaginatedResponseDto<CarSummary> {
    return this.carsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a vehicle by identifier' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle identifier' })
  @ApiResponse({ status: 200, description: 'Vehicle returned successfully', type: Car })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  getCarById(@Param('id', ParseUUIDPipe) id: string): Car {
    return this.carsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new vehicle entry (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully', type: Car })
  @ApiResponse({ status: 400, description: 'Invalid vehicle payload' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createCar(@Body() createCarDto: CreateCarDto): Car {
    return this.carsService.create(createCarDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an existing vehicle entry (ADMIN only)' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle identifier' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully', type: Car })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateCar(
    @Body() carToUpdate: CreateCarDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Car {
    return this.carsService.update(id, carToUpdate);
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
