import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, UserProfileDto } from './dto/auth-response.dto';

@ApiTags('Access Management')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate and issue an access token',
    description:
      'Authenticates a user with email and password and returns a JWT access token to be included in subsequent requests as `Authorization: Bearer <token>`.\n\n' +
      '**Available credentials for the practice environment:**\n' +
      '- Admin: `admin@example.com` / `admin123`\n' +
      '- User: `user@example.com` / `user123`',
  })
  @ApiResponse({
    status: 200,
    description:
      'Authentication completed successfully. Returns the access token and the user profile.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Retrieve the current authenticated user profile',
    description:
      'Returns the profile associated with the JWT access token provided in the Authorization header.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile returned successfully.',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  getProfile(@Req() req): UserProfileDto {
    return req.user;
  }
}
