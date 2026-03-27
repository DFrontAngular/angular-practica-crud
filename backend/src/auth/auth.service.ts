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

interface StoredUser extends User {
  password: string;
}

@Injectable()
export class AuthService {
  private readonly users: StoredUser[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      password: 'admin123',
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Standard User',
      role: UserRole.USER,
      password: 'user123',
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const publicUser = this.toPublicUser(user);
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: publicUser,
    };
  }

  async findById(id: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.id === id);
    return user ? this.toPublicUser(user) : undefined;
  }

  private toPublicUser(user: StoredUser): User {
    const { password: _password, ...publicUser } = user;
    return publicUser;
  }
}
