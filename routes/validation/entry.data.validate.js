// validate dữ liệu đầu vào
var Joi = require("joi");

// example
module.exports = {
  changePassword: {
    body: {
      password: Joi.string().alphanum().required()
    }
  },

  login: {
    body: Joi.object().keys(
      {
        email: Joi.string().email().min(4).max(45).required(),
        password: Joi.string().alphanum().min(4).max(16).required()
      }
    )
  },

  // camera
  createCamera: {
    body: Joi.object().keys(
      {
        name: Joi.string().required(),
        resolution: Joi.string(),
        fileOutput: Joi.string(),
        uri: Joi.string().required(),
        location: Joi.string().required(),
        status: Joi.string().valid("ON", "OFF", "RETIRED").default("OFF"),
        description: Joi.string(),
        type: Joi.string().valid("BINH_RUOU", "CHUONG_GA")
      }
    )
  },

  updateCamera: {
    body: Joi.object().keys(
      {
        id: Joi.number().required(),
        name: Joi.string().required(),
        resolution: Joi.string(),
        fileOutput: Joi.string(),
        uri: Joi.string().required(),
        location: Joi.string().required(),
        status: Joi.string().valid("ON", "OFF", "RETIRED"),
        description: Joi.string(),
        type: Joi.string().valid("BINH_RUOU", "CHUONG_GA")
      }
    )
  },

  findAllCamera: {
    query: {
      name: Joi.string(),
      uri: Joi.string(),
      location: Joi.string(),
      pageNum: Joi.number().min(0),
      pageSize: Joi.number().min(1)
    }
  },

  findAllCameraForDataTable: {
    query: {
      draw: Joi.number(),
      start: Joi.number().min(0),
      length: Joi.number().min(1)
    }
  },

  getDetailCamera: {
    query: {
      cameraId: Joi.number().required()
    }
  },

  //type
  creatType: {
    body: {
      name: Joi.string().min(3).max(30).required()
    }
  },

  updateType: {
    body: {
      id: Joi.number().required(),
      name: Joi.string().min(3).max(30).required()
    }
  },

  findAllType: {
    query: {
      name: Joi.string().min(3).max(30),
      pageNum: Joi.number().min(0).default(0),
      pageSize: Joi.number().min(1).default(5)
    }
  },

  // product
  createProduct: {
    body: {
      name: Joi.string().min(3).max(30).required(),
      original_price: Joi.number().required(),
      sale_price: Joi.number().required(),
      status: Joi.string().valid("HIDDEN", "SHOW").required().default("SHOW"),
      type: Joi.object().allow(null).keys(
        {
          id: Joi.number().required()
          // name: Joi.string().required(),
        }
      ),
      images: Joi.array().items(
        Joi.object().keys({
          id: Joi.number().required(),
          path: Joi.string().required(),
          size: Joi.number(),
          mimetype: Joi.string().required(),
          originalname: Joi.string().required(),
          encoding: Joi.string().required(),
          filename: Joi.string().required(),
          priority: Joi.number().default(0),
          created_at: Joi.date(),
          updated_at: Joi.date()
        })
      ),
      videos: Joi.array().items(
        Joi.object().keys({
          id: Joi.number().required(),
          title: Joi.string().required()
        })
      ),
      camera_id: Joi.number().required(),
      description: Joi.string().max(5000),
      content: Joi.string()
    }
  },
  updateProduct: {
    body: {
      name: Joi.string().min(3).max(30).required(),
      original_price: Joi.number(),
      sale_price: Joi.number(),
      status: Joi.string().valid("HIDDEN", "SHOW").required().default("SHOW"),
      images: Joi.array().items(
        Joi.object().keys({
          id: Joi.number().required(),
          path: Joi.string().required(),
          size: Joi.number(),
          mimetype: Joi.string().required(),
          originalname: Joi.string().required(),
          encoding: Joi.string().required(),
          filename: Joi.string().required(),
          priority: Joi.number().default(0),
          created_at: Joi.date(),
          updated_at: Joi.date()
        })
      ),
      related_videos: Joi.array().items(
        Joi.object().keys(
          {
            id: Joi.number().required(),
            // id_video: Joi.string(),
            // url: Joi.string(),
            // hosted_by: Joi.string(),
            // title: Joi.string(),
            // description: Joi.string(),
            // started_at: Joi.string(),
            // ended_at: Joi.string(),
            // embedded_link: Joi.string(),
            // created_type: Joi.string(),
            // created_at: Joi.date(),
            // updated_at: Joi.date()
          }
        )
      ),
      description: Joi.string().max(5000),
      content: Joi.string()
    }
  },

  updateStatusProduct: {
    body: {
      status: Joi.string().valid("HIDDEN", "SHOW").required().default("SHOW")
    }
  },

  findAllProduct: {
    query: {
      name: Joi.string().min(3).max(30),
      minPrice: Joi.number().min(1000),
      maxPrice: Joi.number().min(1000),
      status: Joi.string().valid("HIDDEN", "SHOW").default("SHOW"),
      pageNum: Joi.number().min(0).default(0),
      pageSize: Joi.number().min(1).default(5)
    }
  },

  findAllProductForDataTable: {
    query: {
      draw: Joi.number(),
      start: Joi.number().min(0),
      length: Joi.number().min(1)
    }
  },

  getDetailProduct: {
    query: {
      productId: Joi.number().required()
    }
  },

  deleteProduct: {
    query: {
      arrId: Joi.array().required()
    }
  },

  // video
  createVideo: {
    body: {
      camera_id: Joi.number().required(),
      id_video: Joi.string(),
      url: Joi.string(),
      hosted_by: Joi.string().valid("FACEBOOK", "DRIVER", "YOUTUBE", "LOCAL"),
      title: Joi.string().required(),
      description: Joi.string(),
      started_at: Joi.date().required(),
      ended_at: Joi.date().required(),
      embedded_link: Joi.string(),
      created_type: Joi.string().valid("FREQUENCY", "BY_PRODUCT", "BY_ADMIN").required(),
    }
  },

  updateVideo: {
    body: {
      id: Joi.string().required(),
      url: Joi.string(),
      hosted_by: Joi.string().valid("FACEBOOK", "DRIVER", "YOUTUBE", "LOCAL"),
      title: Joi.string().required(),
      description: Joi.string(),
      embedded_link: Joi.string(),
    }
  },

  findAllVideo: {
    query: {
      created_type: Joi.string(),
      pageNum: Joi.number().min(0),
      pageSize: Joi.number().min(1)
    }
  },

  findAllVideoForDataTable: {
    query: {
      draw: Joi.number(),
      start: Joi.number().min(0),
      length: Joi.number().min(1)
    }
  },

  deleteVideo: {
    query: {
      arrId: Joi.array().required()
    }
  },

  // order
  createOrder: {
    body: {
      total: Joi.number(),
      status: Joi.string().valid("NEW","CONFIRMED","TRANSFER","SUCCESS","FAILURE","CANCEL"),
      code: Joi.string(),
      payment_type: Joi.string().valid("TRANSFER_MONEY"),
      user_id: Joi.number().required(),
      product_id: Joi.number().required()
    }
  },

  updateOrder: {
    body: {
      id: Joi.string().required(),
      // total: Joi.string(),
      status: Joi.string().valid("NEW","CONFIRMED","TRANSFER","SUCCESS","FAILURE","CANCEL"),
      // code: Joi.string(),
      // payment_type: Joi.string().valid("TRANSFER_MONEY"),
      // user_id: Joi.number().required(),
      // product_id: Joi.number().required()
    }
  },

  findAllOrder: {
    query: {
      code: Joi.string(),
      pageNum: Joi.number().min(0),
      pageSize: Joi.number().min(1)
    }
  },

  findAllOrderForDataTable: {
    query: {
      draw: Joi.number(),
      start: Joi.number().min(0),
      length: Joi.number().min(1)
    }
  },

  deleteOrder: {
    query: {
      arrId: Joi.array().required()
    }
  },
  // user

  findAllUserForDataTable: {
    query: {
      draw: Joi.number(),
      start: Joi.number().min(0),
      length: Joi.number().min(1)
    }
  },


  // news
  createNews: {
    body: {
      title: Joi.string().min(3).required(),
      status: Joi.string().valid("HIDDEN", "SHOW").required().default("SHOW"),
      images: Joi.array().items(
        Joi.object().keys({
          id: Joi.number().required(),
          path: Joi.string().required(),
          size: Joi.number(),
          mimetype: Joi.string().required(),
          originalname: Joi.string().required(),
          encoding: Joi.string().required(),
          filename: Joi.string().required(),
          priority: Joi.number().default(0),
          created_at: Joi.date(),
          updated_at: Joi.date()
        })
      ),
      description: Joi.string().max(5000).required()
    }
  },
  updateNews: {
     body: {
      title: Joi.string().min(3).required(),
      status: Joi.string().valid("HIDDEN", "SHOW").required().default("SHOW"),
      images: Joi.array().items(
        Joi.object().keys({
          id: Joi.number().required(),
          path: Joi.string().required(),
          size: Joi.number(),
          mimetype: Joi.string().required(),
          originalname: Joi.string().required(),
          encoding: Joi.string().required(),
          filename: Joi.string().required(),
          priority: Joi.number().default(0),
          created_at: Joi.date(),
          updated_at: Joi.date()
        })
      ),
      description: Joi.string().max(5000).required()
    }
  },

  findAllNews: {
    query: {
      status: Joi.string().valid("HIDDEN", "SHOW"),
      pageNum: Joi.number().min(0),
      pageSize: Joi.number().min(1)
    }
  },

  findAllNewsForDataTable: {
    query: {
      draw: Joi.number(),
      start: Joi.number().min(0),
      length: Joi.number().min(1)
    }
  },

  getDetailNews: {
    query: {
      newsId: Joi.number().required()
    }
  },

  deleteNews: {
    query: {
      arrId: Joi.array().required()
    }
  },
};
