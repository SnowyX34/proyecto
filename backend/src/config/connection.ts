import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME ?? 'cotizaciones_jgpp',
  process.env.DB_USER ?? 'ulis',
  process.env.DB_PASSWORD ?? 'FiHjAPjq6FEpYrusamf9XP31NuPuPEwE',
  {
    host: process.env.DB_HOST ?? 'dpg-d20kog7fte5s7391c7lg-a.oregon-postgres.render.com',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      keepAlive: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
