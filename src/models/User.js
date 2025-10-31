export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'rolId' , as : 'role'});
    User.hasMany(models.Product, { foreignKey: 'productorId' });
    User.hasMany(models.Stage, { foreignKey: 'actorId' });
    User.hasMany(models.Review, { foreignKey: 'usuarioId' });
    User.hasMany(models.Inventory, { foreignKey: 'distributorId' });
    User.hasMany(models.Batch, { foreignKey: 'distributorId' });
  };

  return User;
};
