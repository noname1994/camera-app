module.exports = (sequelize, DataTypes) => {
  const ImageUpload = sequelize.define(
    "ImageUpload",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      path: {
        type: DataTypes.STRING,
        require: true
      },
      size: {
        type: DataTypes.STRING,
        require: true
      },
      mimetype: {
        type: DataTypes.STRING,
        require: true
      },
      originalname: {
        type: DataTypes.STRING,
        require: true
      },
      encoding: {
        type: DataTypes.STRING,
        require: true
      },
      filename: {
        type: DataTypes.STRING,
        require: true
      },
      priority: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      }
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "image_upload"
    }
  );

  ImageUpload.associate = models => {
    models.ImageUpload.belongsTo(models.Product, {
      as: "product",
      foreignKey: "product_id"
    });
  };

  return ImageUpload;
};
