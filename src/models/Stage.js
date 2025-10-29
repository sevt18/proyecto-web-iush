export default (sequelize, DataTypes) => {
  const Stage = sequelize.define('Stage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'stages',
    timestamps: true
  });

  Stage.associate = (models) => {
    Stage.belongsTo(models.Product, { foreignKey: 'productoId' });
    Stage.belongsTo(models.User, { foreignKey: 'actorId' });
    Stage.belongsTo(models.Location, { foreignKey: 'ubicacionId' });
  };

  return Stage;
};
