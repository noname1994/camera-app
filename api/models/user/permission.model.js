module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define(
      "Permission",
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
        tableName: "permission"
      }
    );
  
    Permission.associate = models => {
      models.Permission.belongsToMany(models.Role, {
        as: "roles",
        through: models.RolePermission,
        foreignKey: "permission_id"
      });
    };
  
    return Permission;
  };
  