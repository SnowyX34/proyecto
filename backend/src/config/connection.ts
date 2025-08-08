import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME ?? 'sqldb_1riw',
  process.env.DB_USER ?? 'useruli',
  process.env.DB_PASSWORD ?? 'A3FKt1R5VgFeVpwI87TtmezUO1K9HgDX',
  {
    host: process.env.DB_HOST ?? 'dpg-d20kog7fte5s7391c7lg-a',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;