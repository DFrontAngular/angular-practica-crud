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

@ApiTags('cars')
@ApiBearerAuth()
@Controller('cars')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cars (paginated & filtered)' })
  @ApiResponse({ status: 200, description: 'Paginated list of cars', type: PaginatedResponseDto })
  getAllCars(@Query() filterDto: GetCarsFilterDto): PaginatedResponseDto<CarSummary> {
    return this.carsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Car ID' })
  @ApiResponse({ status: 200, description: 'Car found', type: Car })
  @ApiResponse({ status: 404, description: 'Car not found' })
  getCarById(@Param('id', ParseUUIDPipe) id: string): Car {
    return this.carsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new car (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Car created', type: Car })
  @ApiResponse({ status: 400, description: 'Error creating car' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createCar(@Body() createCarDto: CreateCarDto): Car {
    return this.carsService.create(createCarDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a car (ADMIN only)' })
  @ApiParam({ name: 'id', type: String, description: 'Car ID' })
  @ApiResponse({ status: 200, description: 'Car updated', type: Car })
  @ApiResponse({ status: 404, description: 'Car not found' })
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
  @ApiOperation({ summary: 'Delete a car (ADMIN only)' })
  @ApiParam({ name: 'id', type: String, description: 'Car ID' })
  @ApiResponse({ status: 204, description: 'Car deleted' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  deleteCar(@Param('id', ParseUUIDPipe) id: string): void {
    this.carsService.remove(id);
  }
}
