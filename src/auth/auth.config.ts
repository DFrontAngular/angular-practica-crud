import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';
import { StringValue } from 'ms';
import { randomBytes } from 'node:crypto';

export const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = '15m' as StringValue;
export const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = '7d' as StringValue;

export const DEFAULT_ACCESS_TOKEN_COOKIE_MAX_AGE_MS = 15 * 60 * 1000;
export const DEFAULT_REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const DEFAULT_COOKIE_PATH = '/';
const DEFAULT_COOKIE_SAME_SITE: CookieOptions['sameSite'] = 'lax';
// Authentication is bypassed in learning mode, but Passport still requires a
// secret while its strategy is being constructed. Keep that value process-local
// so it can never become a usable, repository-known signing key.
const AUTH_DISABLED_JWT_SECRET = randomBytes(32).toString('hex');

const getNumberConfig = (
  configService: ConfigService,
  key: string,
  fallback: number,
): number => {
  const rawValue = configService.get<string>(key);

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const getBooleanConfig = (
  configService: ConfigService,
  key: string,
  fallback: boolean,
): boolean => {
  const rawValue = configService.get<string>(key)?.toLowerCase();

  if (rawValue === 'true') {
    return true;
  }

  if (rawValue === 'false') {
    return false;
  }

  return fallback;
};

const getSameSiteConfig = (configService: ConfigService): CookieOptions['sameSite'] => {
  const rawValue = configService.get<string>('AUTH_COOKIE_SAME_SITE')?.toLowerCase();

  if (rawValue === 'lax' || rawValue === 'strict' || rawValue === 'none') {
    return rawValue;
  }

  return DEFAULT_COOKIE_SAME_SITE;
};

const getCookiePathConfig = (configService: ConfigService): string => {
  const rawValue = configService.get<string>('AUTH_COOKIE_PATH')?.trim();

  if (!rawValue || !rawValue.startsWith('/')) {
    return DEFAULT_COOKIE_PATH;
  }

  return rawValue;
};

const getCommonCookieOptions = (
  configService: ConfigService,
): Pick<CookieOptions, 'httpOnly' | 'sameSite' | 'secure' | 'path'> => ({
  httpOnly: true,
  sameSite: getSameSiteConfig(configService),
  secure: getBooleanConfig(configService, 'AUTH_COOKIE_SECURE', false),
  path: getCookiePathConfig(configService),
});

export const getAccessTokenExpiresIn = (configService: ConfigService): StringValue =>
  (configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') as StringValue) ||
  DEFAULT_ACCESS_TOKEN_EXPIRES_IN;

export const getRefreshTokenExpiresIn = (configService: ConfigService): StringValue =>
  (configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') as StringValue) ||
  DEFAULT_REFRESH_TOKEN_EXPIRES_IN;

export const getJwtSecret = (configService: ConfigService): string => {
  const configuredSecret = configService.get<string>('JWT_SECRET')?.trim();
  if (configuredSecret) {
    return configuredSecret;
  }

  if (configService.get<string>('AUTH_ENABLED') === 'true') {
    throw new Error(
      'JWT_SECRET must be configured when AUTH_ENABLED=true. Set it in .env or in the environment.',
    );
  }

  return AUTH_DISABLED_JWT_SECRET;
};

export const getAccessTokenCookieOptions = (
  configService: ConfigService,
): CookieOptions => ({
  ...getCommonCookieOptions(configService),
  maxAge: getNumberConfig(
    configService,
    'ACCESS_TOKEN_COOKIE_MAX_AGE_MS',
    DEFAULT_ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
  ),
});

export const getRefreshTokenCookieOptions = (
  configService: ConfigService,
): CookieOptions => ({
  ...getCommonCookieOptions(configService),
  maxAge: getNumberConfig(
    configService,
    'REFRESH_TOKEN_COOKIE_MAX_AGE_MS',
    DEFAULT_REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  ),
});

export const getAccessTokenClearCookieOptions = (
  configService: ConfigService,
): CookieOptions => {
  const { maxAge: _maxAge, ...options } = getAccessTokenCookieOptions(configService);
  return options;
};

export const getRefreshTokenClearCookieOptions = (
  configService: ConfigService,
): CookieOptions => {
  const { maxAge: _maxAge, ...options } = getRefreshTokenCookieOptions(configService);
  return options;
};
