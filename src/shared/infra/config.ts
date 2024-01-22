import { config as readEnv } from 'dotenv';
import { join } from 'path';

export class Config {
  static env: any = null;

  static db() {
    Config.readEnv();

    return {
      dialect: 'postgresql' as any,
      url: Config.env.DATABASE_URL,
      logging: Config.env.DATABASE_LOGGING === 'true',
    };
  }

  static readEnv() {
    if (Config.env) {
      return;
    }

    const { parsed } = readEnv({
      path: join(__dirname, `../../../envs/.env.${process.env.NODE_ENV}`),
    });

    Config.env = {
      ...parsed,
      ...process.env,
    };
  }
}