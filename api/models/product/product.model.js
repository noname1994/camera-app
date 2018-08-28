module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        require: true,
        unique: true
      },
      original_price: {
        type: DataTypes.FLOAT,
        require: true
      },
      sale_price: {
        type: DataTypes.FLOAT,
        require: true
      },
      description: {
        type: DataTypes.STRING
      },
      content: {
          type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.ENUM,
        values: ["SHOW", "HIDDEN"]
      }
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "product"
    }
  );

  Product.associate = models => {
    models.Product.hasMany(models.ImageUpload, {
      as: "images"
    });

    models.Product.belongsTo(models.Type, {
      as: "type",
      foreignKey: "type_id"
    });

    // models.Product.belongsToMany(models.Camera, {
    //   as: "cameras",
    //   through: models.ProductCamera,
    //   foreignKey: "product_id"
    // });


    models.Product.belongsTo(models.Camera, {
      as: "camera",
      foreignKey: "camera_id"
    })

    // models.Product.belongsToMany(models.Promotion, {
    //   as: "promotions",
    //   through: models.ProductPromotion,
    //   foreignKey: "product_id"
    // });

    models.Product.belongsToMany(models.Order, {
      as: "orders",
      through: models.OrderProduct,
      foreignKey: "product_id"
    });


    models.Product.hasMany(models.Video, {
      as: "videos",
      foreignKey: "product_id"
    })

  };
  return Product;
};
