import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  host: process.env.HOST ?? '0.0.0.0',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  logLevel: (process.env.LOG_LEVEL ?? 'info') as 'debug' | 'info' | 'warn' | 'error',
  isDev: process.env.NODE_ENV !== 'production',
  dataDir: resolve(__dirname, '../data'),
  savesDir: resolve(__dirname, '../data/saves'),
};
