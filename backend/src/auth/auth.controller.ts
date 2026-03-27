import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login and obtain a JWT token',
    description:
      'Authenticate with email and password. Returns a JWT token to include in subsequent requests as `Authorization: Bearer <token>`.\n\n' +
      '**Test credentials:**\n' +
      '- Admin: `admin@example.com` / `admin123`\n' +
      '- User: `user@example.com` / `user123`',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful. Returns the JWT token and user profile.',
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
    summary: 'Get the current authenticated user profile',
    description: 'Returns the profile of the user whose JWT token is provided in the Authorization header.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile of the currently authenticated user.',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid JWT token.' })
  getProfile(@Req() req): UserProfileDto {
    return req.user;
  }
}
