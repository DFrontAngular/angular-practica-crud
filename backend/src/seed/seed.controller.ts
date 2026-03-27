import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '../auth/auth.service';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { SeedService } from './seed.service';

@ApiTags('Catalog Administration')
@ApiBearerAuth()
@Controller('seed')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Load the predefined catalog dataset',
    description:
      'Replaces the current in-memory vehicle catalog with the predefined dataset used for practice and onboarding.',
  })
  @ApiResponse({
    status: 200,
    description: 'Catalog dataset loaded successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error while loading the catalog dataset',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  populateDB() {
    return this.seedService.populateDB();
  }
}
