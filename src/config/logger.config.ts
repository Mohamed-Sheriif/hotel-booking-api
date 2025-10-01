import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  private static instance: AppLogger;

  constructor() {
    super();
  }

  static getInstance(): AppLogger {
    if (!AppLogger.instance) {
      AppLogger.instance = new AppLogger();
    }
    return AppLogger.instance;
  }

  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
  ) {
    const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;
    this.log(message, 'HTTP');
  }

  logError(error: Error, context?: string) {
    const message = error.message;
    const stack = error.stack;
    this.error(`${message}${stack ? '\n' + stack : ''}`, stack, context);
  }

  logDatabaseQuery(query: string, parameters?: any[], executionTime?: number) {
    const message = `Query: ${query}${parameters ? ` | Params: ${JSON.stringify(parameters)}` : ''}${executionTime ? ` | Time: ${executionTime}ms` : ''}`;
    this.debug(message, 'DATABASE');
  }
}
