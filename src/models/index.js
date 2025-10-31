import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Importar las funciones de modelo
import initUser from './User.js';
import initProduct from './Product.js';
import initInventory from './Inventory.js';
import initBatch from './Batch.js';
import initReview from './Review.js';
import initRole from './Role.js';
import initStage from './Stage.js';
import initLocation from './Location.js';
import initImage from './Image.js';
import initAuditLog from './AuditLog.js';

// Inicializar modelos
const models = {
  User: initUser(sequelize, DataTypes),
  Product: initProduct(sequelize, DataTypes),
  Inventory: initInventory(sequelize, DataTypes),
  Batch: initBatch(sequelize, DataTypes),
  Review: initReview(sequelize, DataTypes),
  Role: initRole(sequelize, DataTypes),
  Stage: initStage(sequelize, DataTypes),
  Location: initLocation(sequelize, DataTypes),
  Image: initImage(sequelize, DataTypes),
  AuditLog: initAuditLog(sequelize, DataTypes),
};

// Configurar asociaciones
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export default models;
