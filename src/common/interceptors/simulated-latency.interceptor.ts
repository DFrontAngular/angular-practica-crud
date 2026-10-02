import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, timer } from 'rxjs';
import { delayWhen, dematerialize, materialize } from 'rxjs/operators';

@Injectable()
export class SimulatedLatencyInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    if (!this.isDelayEnabled()) {
      return next.handle();
    }

    const delayMs = this.getRandomDelayMs();

    return next.handle().pipe(
      materialize(),
      delayWhen(() => timer(delayMs)),
      dematerialize(),
    );
  }

  private isDelayEnabled(): boolean {
    return this.configService.get<string>('API_DELAY_ENABLED') !== 'false';
  }

  private getRandomDelayMs(): number {
    const minDelay = this.getDelayBound('API_DELAY_MIN_MS', 200);
    const maxDelay = this.getDelayBound('API_DELAY_MAX_MS', 900);

    const safeMinDelay = Math.min(minDelay, maxDelay);
    const safeMaxDelay = Math.max(minDelay, maxDelay);

    return (
      Math.floor(Math.random() * (safeMaxDelay - safeMinDelay + 1)) +
      safeMinDelay
    );
  }

  private getDelayBound(key: string, fallback: number): number {
    const rawValue = this.configService.get<string>(key);
    const parsedValue = Number(rawValue);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return fallback;
    }

    return Math.floor(parsedValue);
  }
}
