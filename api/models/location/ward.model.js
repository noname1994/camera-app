module.exports = (sequelize, DataTypes) => {
    const Ward = sequelize.define(
        "Ward",
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
            }
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: "ward"
        }
    )

    Ward.associate = models => {
        models.Ward.belongsTo(models.District, { as: "disctrict" });
    }

    return Ward;
}