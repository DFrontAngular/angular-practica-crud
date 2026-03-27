import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../auth.service';

export class UserProfileDto {
  @ApiProperty({ description: 'Unique user ID', example: '1' })
  id: string;

  @ApiProperty({ description: 'User email address', example: 'admin@example.com' })
  email: string;

  @ApiProperty({ description: 'Display name of the user', example: 'Admin User' })
  name: string;

  @ApiProperty({
    description: 'Role assigned to the user. ADMIN can create, update and delete cars. USER has read-only access.',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT Bearer token. Include it in the Authorization header as: Bearer <token>',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({ type: UserProfileDto, description: 'Basic profile of the authenticated user' })
  user: Omit<UserProfileDto, 'id'>;
}
