module.exports = {
  infoCreate: obj => {
    return {
      name: obj.name,
      // namespace: obj.namespace,
      resolution: obj.resolution,
      fileOutput: obj.fileOutput,
      uri: obj.uri,
      location: obj.location,
      status: obj.status,
      description: obj.description,
      type: obj.type
    };
  },

  infoUpdate: obj => {
    return {
      id: obj.id,
      name: obj.name,
      // namespace: obj.namespace,
      resolution: obj.resolution,
      fileOutput: obj.fileOutput,
      uri: obj.uri,
      location: obj.location,
      status: obj.status,
      description: obj.description,
      type: obj.type
    };
  },

  infoResponse: obj => {
    return {
      id: obj.id,
      name: obj.name,
      namespace: obj.namespace,
      resolution: obj.resolution,
      fileOutput: obj.fileOutput,
      uri: obj.uri,
      location: obj.location,
      status: obj.status,
      description: obj.description,
      type: obj.type,
      videos: obj.video,
      created_at: obj.created_at,
      updated_at: obj.created_at
    };
  }
};
