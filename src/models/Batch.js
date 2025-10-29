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
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'batches',
    timestamps: true
  });

  Batch.associate = (models) => {
    Batch.belongsTo(models.Product, { foreignKey: 'productoId' });
  };

  return Batch;
};
