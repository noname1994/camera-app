module.exports = {
    infoCreate: obj => {
        return {
            id_video: obj.id_video,
            url: obj.url,
            hosted_by: obj.hosted_by,
            title: obj.title,
            description: obj.description,
            started_at: obj.started_at,
            ended_at: obj.ended_at,
            embedded_link: obj.embedded_link,
            created_type: obj.created_type,
            camera_id: obj.camera_id
        };
    },

    infoUpdate: obj => {
        return {
            id: obj.id,
            id_video: obj.id_video,
            url: obj.url,
            hosted_by: obj.hosted_by,
            title: obj.title,
            description: obj.description,
            started_at: obj.started_at,
            ended_at: obj.ended_at,
            embedded_link: obj.embedded_link
        };
    },

    infoResponse: obj => {
        return {
            id: obj.id,
            camera_id: obj.camera_id,
            id_video: obj.id_video,
            url: obj.url,
            hosted_by: obj.hosted_by,
            title: obj.title,
            description: obj.description,
            started_at: obj.started_at,
            ended_at: obj.ended_at,
            embedded_link: obj.embedded_link,
            created_type: obj.created_type,
            created_at: obj.created_at,
            updated_at: obj.created_at
        };
    }
};
