import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

config({ path: '.env.development' });

export const dbOptions: DataSourceOptions = {
  type: 'postgres',
  synchronize: false,
  url: process.env.POSTGRES_DB_URL,
};
