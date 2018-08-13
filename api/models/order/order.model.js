module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        "Order",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            total: {
                type: DataTypes.INTEGER
            },
            status: {
                type: DataTypes.ENUM,
                values: ["STATUS1", "STATUS2"]
            }
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: "order"
        }
    );

    Order.associate = models => {
        models.Order.belongsToMany(models.Product, {
            as: "products",
            through: models.OrderProduct,
            foreignKey: "order_id"
        });

        models.Order.belongsTo(models.User, {
            as: "customer",
            foreignKey: "user_id"
        })

        // models.Order.belongsTo(models.Province, {
        //     as: "province",
        //     foreignKey: "province_id"
        // })
    };

    return Order;
};
