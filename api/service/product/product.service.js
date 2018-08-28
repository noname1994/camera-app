const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

class ProductService {
  create(newProduct, images, type, videos) {
    return sequelize.transaction(t => {
      return models.Product.create(newProduct, { transaction: t }).then(product => {
        return models.Type.findById(type != null ? type.id : null, { transaction: t }).then(type => {
          return product.setType(type, { transaction: t }).then(() => {
            let arrPromise = [];
            if (images) {
              images.forEach(image => {
                arrPromise.push(models.ImageUpload.update({ priority: image.priority, product_id: product.id }, { where: { id: image.id }, transaction: t }));
              });
            }
            if (newProduct.videos) {
              newProduct.videos.forEach(video => {
                arrPromise.push(models.Video.update({ product_id: product.id }, { where: { id: video.id }, transaction: t }));
              });
            }
            return Promise.all(arrPromise).then(() => {
              return product;
            })
          })
        })
      })
    })
  }

  update(newProduct, images, type, relatedVideos) {
    return sequelize.transaction(t => {
      return models.Product.findById(newProduct.id, { transaction: t }).then(product => {
        if (type && type.id) newProduct.type_id = type.id;
        return product.update(newProduct, { transaction: t }).then(() => {
          let arrPromise = [];
          let conditionImage = [];
          // search images by array id 
          images.forEach(image => {
            conditionImage.push({ id: image.id });
          })
          return models.ImageUpload.findAll({ where: { [Op.or]: conditionImage }, transaction: t }).then(imageResult => {
            //update product_id on all new images and  product_id = null in all old images 
            if (imageResult) {
              arrPromise.push(product.setImages(imageResult, { transaction: t }));
            }
            // return product.setImages(imageResult, { transaction: t }).then(() => {
            // update related videos
            let conditionVideos = [];
            relatedVideos.forEach(element => {
              conditionVideos.push({ id: element.id });
            })
            return models.Video.findAll({ where: { [Op.or]: conditionVideos }, transaction: t }).then(videos => {
              if (videos) {
                arrPromise.push(product.setVideos(videos, { transaction: t }));
              }
              // return product.setVideos(videos, { transaction: t }).then(() => {
              //   return product;
              // });
              return Promise.all(arrPromise).then(() => {
                return product;
              })
            })
            // })
          });
        })
      })
    })
  }

  updateStatus(productId, status) {
    return models.Product.update({ status }, { where: { id: productId } });
  }

  delete(arrId) {
    return models.Product.destroy({ where: { id: arrId } });
  }

  findById(productId) {
    return models.Product.findById(productId, {
      include: [
        {
          model: models.ImageUpload,
          as: "images"
        },
        {
          model: models.Type,
          as: "type"
        },
        //  {
        //   model: models.Video,
        //   as: "videos",
        //   through: {
        //     attributes: []
        //   }
        // }
      ]
    });
  }

  findByName(name) {
    return models.Product.findOne({
      where: { name: name }
    });
  }

  findAll(params) {
    let name = params.name;
    let minPrice = params.minPrice;
    let maxPrice = params.maxPrice;
    let status = params.status;
    let typeName = params.typeName;
    let limit = params.limit;
    let offset = params.offset;

    let conditions = {};  // using for search by product 

    let conditionOfType = {}; // using for search by type of product 

    // build condition for product
    if (name) {
      conditions.name = { [Op.like]: "%" + name + "%" };
    }

    if (minPrice) {

    }

    if (maxPrice) {

    }

    if (status) {
      conditions.status = { [Op.eq]: status };
    }

    //  build condition for Type of product
    if (typeName) {
      conditionOfType.name = { [Op.like]: "%" + typeName + "%" };
    }

    return models.Product.findAndCountAll(
      {
        where: conditions,
        limit,
        offset,
        include: [
          {
            model: models.ImageUpload,
            as: "images"
          },
          {
            model: models.Video,
            as: "videos"
          },
          {
            model: models.Type,
            as: "type",
            where: conditionOfType 
          }
        ]
      }
    )
  }
}

module.exports = ProductService;
