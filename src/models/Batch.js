export default (sequelize, DataTypes) => {
  const Batch = sequelize.define('Batch', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    loteCodigo: {
      type: DataTypes.STRING,
      allowNull: false
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
    tableName: 'batches',
    timestamps: true
  });

  Batch.associate = (models) => {
    Batch.belongsTo(models.Product, { foreignKey: 'productoId' });
    Batch.belongsTo(models.User, { foreignKey: 'distributorId' });
  };

  return Batch;
};
