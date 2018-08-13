module.exports = (sequelize, DataTypes) => {
    const District = sequelize.define(
        "District",
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
            tableName: "district"
        }
    )

    District.associate = models => {
        models.District.belongsTo(models.Province, { as: "province" });

        // models.District.hasMany(models.Ward, {
        //     as: "wards"
        // })

    }

    return District;
}