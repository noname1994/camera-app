module.exports = (sequelize, DataTypes) => {
  const Camera = sequelize.define(
    "Camera",
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
      namespace: {
        type: DataTypes.STRING,
        require: true,
        unique: true
      },
      resolution: {
        type: DataTypes.STRING,
        require: true
      },
      fileOutput: {
        type: DataTypes.STRING,
        require: true
      },
      uri: {
        type: DataTypes.STRING,
        require: true,
        unique: true
      },
      location: {
        type: DataTypes.STRING,
        require: true
      },
      status: {
        type: DataTypes.ENUM,
        values: ["ON", "OFF", "RETIRED"],
        defaultValue: "OFF"
      },
      description: {
        type: DataTypes.STRING
      },
      type: {
        type: DataTypes.ENUM,
        values: ["BINH_RUOU", "CHUONG_GA"],
        require: true
      },
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "camera"
    }
  );

  Camera.associate = models => {
    // models.Camera.belongsToMany(models.Product, {
    //   as: "products",
    //   through: models.ProductCamera,
    //   foreignKey: "camera_id"
    // });

    
    models.Camera.hasMany(models.Video, {
      as: "videos"
    });
  };

  return Camera;
};
