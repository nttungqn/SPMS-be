import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as Config from 'config/config';

@Injectable()
export class DatabaseConnectionService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'mysql',
      host: Config.DB_HOSTNAME,
      port: Number(Config.DB_PORT),
      username: Config.DB_USERNAME,
      password: Config.DB_PASSWORD,
      database: Config.DB_NAME,
      synchronize: false,
      dropSchema: false,
      logging: false,
      entities: [this.getMigrationDirectory()],
      extra: {
        connectLimit: Config.DB_POOL_CONNECTION
      }
    };
  }
  getMigrationDirectory() {
    if (process.env.NODE_ENV == 'production') {
      return `dist/**/entity/*{.ts,.js}`;
    }
    return `src/**/entity/*.ts`;
  }
}
