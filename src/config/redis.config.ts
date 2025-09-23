import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS as string) || 120,
  maxItems: parseInt(process.env.CACHE_MAX_ITEMS as string) || 1000,
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT as string) || 6379,
  password: process.env.REDIS_PASSWORD,
}));
