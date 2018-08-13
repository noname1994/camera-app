module.exports = (sequelize, DataTypes) => {
    const RolePermission = sequelize.define(
      "RolePermission",
      {},
      {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        tableName: "role_permission"
      }
    );
  
    return RolePermission;
  };
  