import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

config();

export const dbOptions: DataSourceOptions = {
  type: 'postgres',
  synchronize: false,
  url:
    process.env.POSTGRES_DB_URL ??
    'postgresql://postgres:postgres@localhost:3334',
};
