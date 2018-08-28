module.exports = {

    infoCreate: (obj) => {
        return {
            id: obj.id,
            title: obj.title,
            status: obj.status,
            description: obj.description,
            content: obj.content
        }
    },

    infoUpdate: (obj) => {
        return {
            id: obj.id,
            title: obj.title,
            name: obj.name,
            status: obj.status,
            description: obj.description,
            content: obj.content
        }
    },

    infoResponse: (obj) => {
        return {
            id: obj.id,
            title: obj.title,
            name: obj.name,
            status: obj.status,
            description: obj.description,
            content: obj.content,
            images: obj.images,
            created_at: obj.created_at,
            updated_at: obj.updated_at
        }
    }
}