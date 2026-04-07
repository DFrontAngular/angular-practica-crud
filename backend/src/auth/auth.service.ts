import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { getAccessTokenExpiresIn, getRefreshTokenExpiresIn } from './auth.config';

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

export interface AuthenticatedSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RefreshTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  sessionId: string;
  tokenId: string;
  type: 'refresh';
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

  private readonly refreshSessions = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<AuthenticatedSession> {
    const user = this.users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const publicUser = this.toPublicUser(user);

    return {
      ...this.createSessionTokens(user),
      user: publicUser,
    };
  }

  async refreshSession(refreshToken: string): Promise<AuthenticatedSession> {
    const payload = await this.verifyRefreshToken(refreshToken);

    const activeUserId = this.refreshSessions.get(payload.tokenId);
    if (!activeUserId || activeUserId !== payload.sub) {
      throw new UnauthorizedException('Refresh session is no longer active.');
    }

    const user = this.users.find((storedUser) => storedUser.id === payload.sub);
    if (!user) {
      this.refreshSessions.delete(payload.tokenId);
      throw new UnauthorizedException('Authenticated user not found.');
    }

    this.refreshSessions.delete(payload.tokenId);

    return {
      ...this.createSessionTokens(user),
      user: this.toPublicUser(user),
    };
  }

  logout(userId?: string): void {
    if (!userId) {
      return;
    }

    for (const [tokenId, sessionUserId] of this.refreshSessions.entries()) {
      if (sessionUserId === userId) {
        this.refreshSessions.delete(tokenId);
      }
    }
  }

  async logoutByRefreshToken(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      this.refreshSessions.delete(payload.tokenId);
    } catch {
      return;
    }
  }

  async findById(id: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.id === id);
    return user ? this.toPublicUser(user) : undefined;
  }

  private createSessionTokens(user: StoredUser): {
    accessToken: string;
    refreshToken: string;
  } {
    const tokenId = randomUUID();
    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: tokenId,
    };
    const refreshPayload: RefreshTokenPayload = {
      ...accessPayload,
      tokenId,
      type: 'refresh',
    };

    this.refreshSessions.set(tokenId, user.id);

    return {
      accessToken: this.jwtService.sign(accessPayload, {
        expiresIn: getAccessTokenExpiresIn(this.configService),
      }),
      refreshToken: this.jwtService.sign(refreshPayload, {
        expiresIn: getRefreshTokenExpiresIn(this.configService),
      }),
    };
  }

  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenPayload> {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token type.');
    }

    return payload;
  }

  private toPublicUser(user: StoredUser): User {
    const { password: _password, ...publicUser } = user;
    return publicUser;
  }
}
