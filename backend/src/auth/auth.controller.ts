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
import { ConfigService } from '@nestjs/config';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  getAccessTokenClearCookieOptions,
  getAccessTokenCookieOptions,
  getRefreshTokenClearCookieOptions,
  getRefreshTokenCookieOptions,
} from './auth.config';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from './auth.constants';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, UserProfileDto } from './dto/auth-response.dto';

@ApiTags('Access Management')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setNoStoreHeaders(response: Response): void {
    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', '0');
  }

  private setSessionCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    response.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      getAccessTokenCookieOptions(this.configService),
    );

    response.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      getRefreshTokenCookieOptions(this.configService),
    );
  }

  private clearSessionCookies(response: Response): void {
    response.clearCookie(
      ACCESS_TOKEN_COOKIE_NAME,
      getAccessTokenClearCookieOptions(this.configService),
    );

    response.clearCookie(
      REFRESH_TOKEN_COOKIE_NAME,
      getRefreshTokenClearCookieOptions(this.configService),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate and issue access and refresh cookies',
    description:
      `Authenticates a user with email and password, issues an HttpOnly access cookie and an HttpOnly refresh cookie, and returns the authenticated user profile. In Swagger, this is the first endpoint to call before trying protected routes. The frontend should use \`withCredentials\` on subsequent requests instead of manually storing tokens.\n\n` +
      'The access token uses the configured short-lived expiration and the refresh token uses the configured longer-lived expiration. The frontend should call `POST /auth/refresh` after a `401` caused by an expired access token.\n\n' +
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
    this.setNoStoreHeaders(response);
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
    this.setNoStoreHeaders(response);
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
    this.setNoStoreHeaders(response);
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
  getProfile(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ): UserProfileDto {
    this.setNoStoreHeaders(response);
    return req.user;
  }
}
