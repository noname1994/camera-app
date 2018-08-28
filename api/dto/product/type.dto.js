module.exports = {

    infoCreate: (obj) => {
        return {
            name: obj.name
        }
    },

    infoUpdate: (obj) => {
        return {
            id: obj.id,
            name: obj.name
        }
    },

    infoResponse: (obj) => {
        return {
            id: obj.id,
            name: obj.name,
            created_at: obj.created_at,
            updated_at: obj.updated_at
        }
    }
}