export default (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    distributorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'inventories',
    timestamps: true
  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Product, { foreignKey: 'productoId' });
    Inventory.belongsTo(models.User, { foreignKey: 'distributorId' });
  };

  return Inventory;
};
