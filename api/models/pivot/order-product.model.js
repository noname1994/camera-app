module.exports = (sequelize, DataTypes) => {
    const OrderProduct = sequelize.define(
        "OrderProduct",
        {
            number: {
                type: DataTypes.INTEGER,
                require: true
            },

            total_price: {
                type: DataTypes.INTEGER,
                require: true
            }

        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: "order_product"
        }
    );

    return OrderProduct;
};
