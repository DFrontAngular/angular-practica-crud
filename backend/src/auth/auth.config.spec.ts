import { ConfigService } from '@nestjs/config';
import { getJwtSecret } from './auth.config';

const createConfigService = (values: Record<string, string | undefined>) =>
  {
    get: jest.fn((key: string) => values[key]),
  } as unknown as ConfigService;

describe('getJwtSecret', () => {
  it('uses the configured secret', () => {
    const configService = createConfigService({
      AUTH_ENABLED: 'true',
      JWT_SECRET: 'test-secret',
    });

    expect(getJwtSecret(configService)).toBe('test-secret');
  });

  it('rejects authenticated mode without a secret', () => {
    const configService = createConfigService({ AUTH_ENABLED: 'true' });

    expect(() => getJwtSecret(configService)).toThrow(
      'JWT_SECRET must be configured when AUTH_ENABLED=true',
    );
  });

  it('provides a process-local secret while authentication is bypassed', () => {
    const configService = createConfigService({ AUTH_ENABLED: 'false' });

    expect(getJwtSecret(configService)).toMatch(/^[a-f0-9]{64}$/);
  });
});
