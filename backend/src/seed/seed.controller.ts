import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Catalog Administration')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
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
  populateDB() {
    return this.seedService.populateDB();
  }
}
