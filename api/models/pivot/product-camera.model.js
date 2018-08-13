module.exports = (sequelize, DataTypes) => {
  const ProductCamera = sequelize.define(
    "ProductCamera",
    {},
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "product_camera"
    }
  );

  return ProductCamera;
};
