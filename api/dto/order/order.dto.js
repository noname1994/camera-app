module.exports = {

    infoCreate: (obj) => {
        return {
            total: obj.total,
            status: obj.status,
            payment_type: obj.payment_type,
            user_id: obj.user_id,
            product_id: obj.product_id
        }
    },

    infoUpdate: (obj) => {
        return {
            id: obj.id,
            total: obj.total,
            status: obj.status,
            payment_type: obj.payment_type,
            user_id: obj.user_id,
            product_id: obj.product_id
        }
    },

    infoResponse: (obj) => {
        return {
            id: obj.id,
            total: obj.total,
            status: obj.status,
            code: obj.code,
            payment_type: obj.payment_type,
            customer: obj.customer,
            products: obj.products,
            created_at: obj.created_at,
            updated_at: obj.updated_at
        }
    }
}