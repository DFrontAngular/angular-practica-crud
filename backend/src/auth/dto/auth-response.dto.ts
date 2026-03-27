import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../auth.service';

export class UserProfileDto {
  @ApiProperty({ description: 'Unique user identifier', example: '1' })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'admin@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Display name associated with the account',
    example: 'Admin User',
  })
  name: string;

  @ApiProperty({
    description:
      'Role assigned to the account. ADMIN can create, update and delete vehicles. USER has read-only access.',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;
}

export class LoginResponseDto {
  @ApiProperty({
    description:
      'JWT bearer token. Include it in the Authorization header as: Bearer <token>',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    type: UserProfileDto,
    description: 'Profile of the authenticated user',
  })
  user: Omit<UserProfileDto, 'id'>;
}
