export default (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombreLugar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitud: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitud: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'locations',
    timestamps: false
  });

  Location.associate = (models) => {
    Location.hasMany(models.Stage, { foreignKey: 'ubicacionId' });
  };

  return Location;
};
