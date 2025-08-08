"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../../config/connection")); // Asegúrate de que apunta correctamente
// CAMBIO: La clase User ahora es el modelo exportado directamente
class User extends sequelize_1.Model {
    // Método estático para definir las asociaciones
    static associate(models) {
        var _a;
        console.log('User.associate called. models.Quotation:', models.Quotation ? 'Defined' : 'Undefined', 'models.Quotation.name:', (_a = models.Quotation) === null || _a === void 0 ? void 0 : _a.name);
        User.hasMany(models.Quotation, {
            foreignKey: 'user_id',
            as: 'quotations',
            sourceKey: 'user_id'
        });
    }
}
exports.User = User;
// Inicialización del modelo (ahora en la propia clase User)
User.init({
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    user_secondName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.STRING, // admin, usuario, etc.
        defaultValue: 'usuario',
        allowNull: false
    },
    avatarUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: '/uploads/default-user.png',
    },
}, {
    sequelize: connection_1.default,
    modelName: 'User', // CAMBIO: modelName a 'User'
    tableName: 'users', // CAMBIO: tableName a 'users' (minúsculas, consistente con Sequelize)
    timestamps: false
});
// CAMBIO: Exportar User directamente (ya no es default)
// export default User; // REMOVIDO
