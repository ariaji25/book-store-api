import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmModuleOption = <TypeOrmModuleOptions>{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  ssl: true,
  synchronize: true,
};
