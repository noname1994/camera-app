module.exports = (sequelize, DataTypes) => {
    const ProductPromotion = sequelize.define(
        "ProductPromotion",
        {
            date_start: {
                type: DataTypes.DATE
            },
            date_end: {
                type: DataTypes.DATE
            }
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: "product_promotion"
        }
    );

    return ProductPromotion;
};
