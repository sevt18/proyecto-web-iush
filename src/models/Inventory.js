export default (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'inventories',
    timestamps: true
  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Product, { foreignKey: 'productoId' });
  };

  return Inventory;
};
