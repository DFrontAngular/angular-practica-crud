import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isAuthEnabled =
      this.configService.get<string>('AUTH_ENABLED') === 'true';

    if (!isAuthEnabled) {
      // Bypass authentication: inject a default admin user into the request
      const request = context.switchToHttp().getRequest();
      request.user = {
        userId: 'admin-id',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      return true;
    }

    // Otherwise, use the standard check
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
