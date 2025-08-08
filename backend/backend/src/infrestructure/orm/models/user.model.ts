import {
  Optional,
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin
} from 'sequelize';
import sequelize from '../../../config/connection'; // Asegúrate de que apunta correctamente
import Quotation from './quotation.model'; // Importa el modelo Quotation

// CAMBIO: Renombrado IUser a UserAttributes para consistencia
export interface UserAttributes {
  user_id: number;
  user_name: string;
  user_secondName: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
  avatarUrl: string;
}

// CAMBIO: Renombrado UserCreationAttributes para consistencia
export type UserCreationAttributes = Optional<UserAttributes, 'user_id'>;

// CAMBIO: La clase User ahora es el modelo exportado directamente
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public user_name!: string;
  public user_secondName!: string;
  public email!: string;
  public password!: string;
  public phone_number!: string;
  public role!: string;
  public avatarUrl!: string;

  // Mixins de asociación para el modelo Quotation
  public getQuotations!: HasManyGetAssociationsMixin<Quotation>;
  public addQuotation!: HasManyAddAssociationMixin<Quotation, number>;
  public hasQuotation!: HasManyHasAssociationMixin<Quotation, number>;
  public countQuotations!: HasManyCountAssociationsMixin;
  public createQuotation!: HasManyCreateAssociationMixin<Quotation>;

  // Método estático para definir las asociaciones
  public static associate(models: { Quotation: typeof Quotation }) {
    console.log('User.associate called. models.Quotation:', models.Quotation ? 'Defined' : 'Undefined', 'models.Quotation.name:', models.Quotation?.name);
    User.hasMany(models.Quotation, { // CAMBIO: Usar 'User' en lugar de 'UserInstance'
      foreignKey: 'user_id',
      as: 'quotations',
      sourceKey: 'user_id'
    });
  }
}

// Inicialización del modelo (ahora en la propia clase User)
User.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_secondName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING, // admin, usuario, etc.
    defaultValue: 'usuario',
    allowNull: false
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '/uploads/default-user.png',
  },
}, {
  sequelize,
  modelName: 'User', // CAMBIO: modelName a 'User'
  tableName: 'users', // CAMBIO: tableName a 'users' (minúsculas, consistente con Sequelize)
  timestamps: false
});

// CAMBIO: Exportar User directamente (ya no es default)
// export default User; // REMOVIDO
