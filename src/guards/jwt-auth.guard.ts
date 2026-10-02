import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../auth/auth.service';

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
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: UserRole.ADMIN,
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
