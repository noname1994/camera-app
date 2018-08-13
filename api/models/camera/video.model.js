module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define(
    "Video",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_video: {
        type: DataTypes.STRING
      },
      url: {
        type: DataTypes.TEXT,
        require: false
      },
      hosted_by: {
        type: DataTypes.ENUM,
        values: ["FACEBOOK", "DRIVER", "YOUTUBE", "LOCAL"],
        require: true
      },
      title: {
        type: DataTypes.STRING,
        require: true
      },
      description: {
        type: DataTypes.TEXT,
        require: false
      },
      started_at: {
        type: DataTypes.DATE,
        require: true
      },
      ended_at: {
        type: DataTypes.DATE,
        require: true
      },
      embedded_link: {
        type: DataTypes.TEXT
      },
      created_type: {
        type: DataTypes.ENUM,
        values: ["FREQUENCY", "BY_PRODUCT"],
        require: true
      }
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "video"
    }
  );

  Video.associate = models => {
    models.Video.belongsTo(models.Camera, {
      as: "camera",
      foreignKey: "camera_id"
    });


    models.Video.belongsTo(models.Product, {
      as: "product",
      foreignKey: "product_id"
    });

  };

  return Video;
};
