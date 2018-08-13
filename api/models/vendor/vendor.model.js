module.exports = (sequelize, DataTypes) => {
    const Vendor = sequelize.define(
        "Vendor",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: "vendor"
        }
    );

    return Vendor;
};
