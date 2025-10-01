import { Injectable } from '@nestjs/common';
import { AppLogger } from './config/logger.config';

@Injectable()
export class AppService {
  private readonly logger = AppLogger.getInstance();

  getHello(): string {
    this.logger.log('Hello endpoint accessed', 'AppService');
    return 'Hello World!';
  }
}
