module.exports = (sequelize, DataTypes) => {
    const Province = sequelize.define(
        "Province",
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
            tableName: "province"
        }
    )

    Province.associate = models => {

        // models.Province.hasMany(models.District, {
        //     as: "districts",
        //     foreignKey: "province_id"
        // })

    }


    return Province;
}