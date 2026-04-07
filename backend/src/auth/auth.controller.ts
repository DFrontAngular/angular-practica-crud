import {
  UnauthorizedException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_MAX_AGE_MS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_MAX_AGE_MS,
} from './auth.constants';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, UserProfileDto } from './dto/auth-response.dto';

@ApiTags('Access Management')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setSessionCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
      path: '/',
    });

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
      path: '/auth',
    });
  }

  private clearSessionCookies(response: Response): void {
    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/auth',
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate and issue access and refresh cookies',
    description:
      `Authenticates a user with email and password, issues an HttpOnly access cookie and an HttpOnly refresh cookie, and returns the authenticated user profile. In Swagger, this is the first endpoint to call before trying protected routes. The frontend should use \`withCredentials\` on subsequent requests instead of manually storing tokens.\n\n` +
      `The access token expires after ${ACCESS_TOKEN_EXPIRES_IN} and the refresh token expires after ${REFRESH_TOKEN_EXPIRES_IN}. The frontend should call \`POST /auth/refresh\` after a \`401\` caused by an expired access token.\n\n` +
      '**Available credentials for the practice environment:**\n' +
      '- Admin: `admin@example.com` / `admin123`\n' +
      '- User: `user@example.com` / `user123`',
  })
  @ApiResponse({
    status: 200,
    description:
      'Authentication completed successfully. Returns the user profile and sets the access and refresh cookies.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const session = await this.authService.login(loginDto.email, loginDto.password);

    this.setSessionCookies(response, session.accessToken, session.refreshToken);

    return { user: session.user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(REFRESH_TOKEN_COOKIE_NAME)
  @ApiOperation({
    summary: 'Rotate the refresh token and renew the access cookie',
    description:
      'Uses the HttpOnly refresh cookie to issue a new short-lived access token and rotate the refresh token. In Swagger, call this after `POST /auth/login` if a protected endpoint starts returning 401 because the access cookie expired.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Session renewed successfully. New access and refresh cookies were issued.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid refresh cookie.' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      this.clearSessionCookies(response);
      throw new UnauthorizedException('Missing refresh token cookie.');
    }

    try {
      const session = await this.authService.refreshSession(refreshToken);
      this.setSessionCookies(response, session.accessToken, session.refreshToken);

      return { user: session.user };
    } catch (error) {
      this.clearSessionCookies(response);
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Clear the authenticated session cookies',
    description:
      'Removes the HttpOnly access and refresh cookies used by the application and invalidates the active refresh session. In Swagger, calling this endpoint should make `GET /auth/me` return 401 afterwards.',
  })
  @ApiResponse({ status: 204, description: 'Session cookies cleared successfully.' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const authenticatedUser = request.user as UserProfileDto | undefined;
    const userId = authenticatedUser?.id;
    const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (userId) {
      this.authService.logout(userId);
    } else {
      await this.authService.logoutByRefreshToken(refreshToken);
    }

    this.clearSessionCookies(response);
  }

  @ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Retrieve the current authenticated user profile',
    description:
      'Returns the profile associated with the short-lived access cookie. In Swagger, use this endpoint immediately after `POST /auth/login` to verify that the browser session is already authenticated.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile returned successfully.',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access cookie.' })
  getProfile(@Req() req): UserProfileDto {
    return req.user;
  }
}
