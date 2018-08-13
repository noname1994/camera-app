module.exports = {
    infoCreate: (obj) => {
        return {
            path: obj.path,
            size: obj.size,
            mimetype: obj.mimetype,
            originalname: obj.originalname,
            encoding: obj.encoding,
            filename: obj.filename,
        }
    },

    infoUpdate: (obj) => {
        return {
            id: obj.id,
            priority: obj.priority
        }
    },

    infoFind: (obj) => {
        return {
            id: obj.id,
            originalname: obj.originalname
        }
    },

    infoResponse: (obj) => {
        return {
            id: obj.id,
            path: obj.path,
            size: obj.size,
            mimetype: obj.mimetype,
            originalname: obj.originalname,
            encoding: obj.encoding,
            filename: obj.filename,
            priority: obj.priority,
            create_at: obj.create_at,
            update_at: obj.update_at
        }
    }
}