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
      description: obj.description
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
      description: obj.description
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
      videos: obj.video,
      created_at: obj.created_at,
      updated_at: obj.created_at
    };
  }
};
