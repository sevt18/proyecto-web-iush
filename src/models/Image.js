export default (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'images',
    timestamps: true
  });

  Image.associate = (models) => {
    Image.belongsTo(models.Product, { foreignKey: 'productoId' });
  };

  return Image;
};
