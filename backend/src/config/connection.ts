 import { Sequelize } from 'sequelize';

 const sequelize = new Sequelize(
   process.env.DB_NAME ?? 'cotizaciones_jgpp',
   process.env.DB_USER ?? 'ulis',
   process.env.DB_PASSWORD ?? 'FiHjAPjq6FEpYrusamf9XP31NuPuPEwE',
   {
     host: process.env.DB_HOST ?? 'dpg-d2bgu5p5pdvs73cofn2g-a',
     port: parseInt(process.env.DB_PORT ?? '5432'),
     dialect: 'postgres',
     logging: false,
   }
);

export default sequelize;
