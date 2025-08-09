import { Sequelize } from 'sequelize';

console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);

const sequelize = new Sequelize(
  process.env.DB_NAME ?? 'cotizaciones_jgpp',
  process.env.DB_USER ?? 'ulis',
  process.env.DB_PASSWORD ?? 'FiHjAPjq6FEpYrusamf9XP31NuPuPEwE',
  {
    host: process.env.DB_HOST ?? 'd2bgu5p5pdvs73cofn2g-a.oregon-postgres.render.com',
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
