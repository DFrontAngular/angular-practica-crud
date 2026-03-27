import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      role: UserRole.USER,
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string) {
    // For a simple demo, any password works if email exists
    const user = this.users.find((u) => u.email === email);
    if (!user || (password !== 'admin123' && password !== 'user123')) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }
}
