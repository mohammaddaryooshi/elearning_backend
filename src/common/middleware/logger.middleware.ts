import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    // Use X-Forwarded-For with care — trust only when behind a known proxy
    const ip = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown';
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      // Never log Authorization header values or request bodies
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} — ${duration}ms [${ip}]`,
      );
    });

    next();
  }
}
