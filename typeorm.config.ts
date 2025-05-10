import { DataSource, DataSourceOptions } from 'typeorm';
import { dbOptions } from './src/core/dbOptions';

console.log(dbOptions);

const migrationsOptions: DataSourceOptions = {
  migrations: ['migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
  ...dbOptions,
};

export default new DataSource(migrationsOptions);
