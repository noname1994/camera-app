module.exports = {

    infoCreate: (obj) => {
        return {
            name: obj.name,
            original_price: obj.original_price,
            sale_price: obj.sale_price,
            status: obj.status,
            description: obj.description,
            content: obj.content,
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
            content: obj.content,
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
            content: obj.content,
            type: obj.type,
            images: obj.images,
            videos: obj.videos,
            created_at: obj.created_at,
            updated_at: obj.updated_at
        }
    }
}