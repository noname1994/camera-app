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
            name: obj.name
        }
    }
}