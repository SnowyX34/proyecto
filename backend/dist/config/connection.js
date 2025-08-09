"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize((_a = process.env.DB_NAME) !== null && _a !== void 0 ? _a : 'cotizaciones_jgpp', (_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : 'ulis', (_c = process.env.DB_PASSWORD) !== null && _c !== void 0 ? _c : 'FiHjAPjq6FEpYrusamf9XP31NuPuPEwE', {
    host: (_d = process.env.DB_HOST) !== null && _d !== void 0 ? _d : 'dpg-d20kog7fte5s7391c7lg-a.oregon-postgres.render.com',
    port: parseInt((_e = process.env.DB_PORT) !== null && _e !== void 0 ? _e : '5432'),
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
});
exports.default = sequelize;
