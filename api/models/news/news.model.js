module.exports = (sequelize, DataTypes) => {
    const News = sequelize.define(
        "News",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING
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
            tableName: "news"
        }
    );
    News.associate = models => {
        models.News.hasMany(models.ImageUpload, {
            as: "images"
        });
    };
    return News;
};
