module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {},
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "user_Role"
    }
  );

  return UserRole;
};
