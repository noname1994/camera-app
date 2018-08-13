module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      tableName: "role"
    }
  );

  Role.associate = models => {
    models.Role.belongsToMany(models.User, {
      as: "users",
      through: models.UserRole,
      foreignKey: "role_id"
    });
  };

  Role.associate = models => {
    models.Role.belongsToMany(models.Permission, {
      as: "permissions",
      through: models.RolePermission,
      foreignKey: "role_id"
    });
  };


  return Role;
};
