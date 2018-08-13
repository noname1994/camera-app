const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

const attributesUser = ["id", "email", "fullname", "phone_number", "password", "address", "created_at", "updated_at"];

const attributesRole = ["id", "name"];

class UserService {

  createUser(newUser){
    
  }

  updatePassword(newPassword, user) {
    return models.User.update({ password: newPassword }, { where: { email: user.email } });
  }

  updateUser(email, userUpdate) {
    return models.User.findOne({ where: { email } }).then(user => {
      return user.update(userUpdate);
    });
  }

  findByEmail(email) {
    return models.User.findOne({
      where: { email },
      attributes: attributesUser,
      include: [
        {
          model: models.Role,
          as: "roles",
          through: {
            attributes: []
          }
        }
      ]
    });
  }

  findAll(params) {
    let limit = params.limit;
    let offset = params.offset;
    let conditions = {};

    return models.User.findAndCountAll({ where: conditions, limit, offset });
}
}

module.exports = UserService;
