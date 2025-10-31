export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaProduccion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    codigoTrazabilidad: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'products',
    timestamps: true
  });

  Product.associate = (models) => {
    Product.belongsTo(models.User, { foreignKey: 'productorId' });
    Product.hasOne(models.Batch, { foreignKey: 'productoId' });
    Product.hasMany(models.Stage, { foreignKey: 'productoId' });
    Product.hasMany(models.Inventory, { foreignKey: 'productoId' });
    Product.hasMany(models.Image, { foreignKey: 'productoId' });
    Product.hasMany(models.Review, { foreignKey: 'productoId' });
  };

  return Product;
};
