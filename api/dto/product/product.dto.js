module.exports = {

    infoCreate: (obj) => {
        return {
            name: obj.name,
            original_price: obj.original_price,
            sale_price: obj.sale_price,
            status: obj.status,
            description: obj.description,
            videos: obj.videos,
            camera_id: obj.camera_id
        }
    },

    infoUpdate: (obj) => {
        return {
            id: obj.id,
            name: obj.name,
            original_price: obj.original_price,
            sale_price: obj.sale_price,
            status: obj.status,
            description: obj.description,
            videos: obj.videos,
            camera_id: obj.camera_id
        }
    },

    infoResponse: (obj) => {
        return {
            id: obj.id,
            camera_id: obj.camera_id,
            name: obj.name,
            original_price: obj.original_price,
            sale_price: obj.sale_price,
            status: obj.status,
            description: obj.description,
            type: obj.type,
            images: obj.images,
            videos: obj.videos,
            create_at: obj.create_at,
            update_at: obj.update_at
        }
    }
}