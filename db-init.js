/**
 * When Server init db-init.js will create fake database
 */

const fs = require("fs");
const path = require("path");
const db = require("./api/models/index");

class FakeDatabase {
    init() {
        let data = fs.readFileSync(path.join(__dirname + "/config/db-fake.json"));
        if (!data) {
            throw new Error("Can't not file camera.config !");
        }

        let obj = JSON.parse(data);

        console.log("obj : ", obj);

        let cameras = obj.camera || [];

        let roles = obj.roles || [];

        let users = obj.users || [];

        db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true }).then(function (results) {
            db.sequelize.sync({ force: true })
                .then(() => {

                    // note : name, uri, namespace of camera are unique
                    db.Camera.bulkCreate(
                        cameras
                    ).then(result => {
                    }).catch(error => {
                        console.log("error: ", error);
                    })

                    roles.forEach(role => {
                        db.Role.findOrCreate({
                            where: {
                                name: role.name
                            }
                        })
                    });

                    users.forEach(user => {
                        db.User.findOrCreate({
                            where: {
                                email: user.email
                            },
                            defaults: {
                                password: user.password,
                                fullname: user.fullname,
                                phone_number: user.phone_number,
                                address: user.address
                            }
                        })
                    })


                    //     db.Role.findOrCreate({
                    //         where: {
                    //             name: "ADMIN"
                    //         }
                    //     })
                    //         .spread(function (roleResult, created) {
                    //             db.User.findOrCreate({
                    //                 where: {
                    //                     email: "tranducninhnd94@hotmail.com"
                    //                 },
                    //                 defaults: {
                    //                     password: "1234",
                    //                     fullname: "Tran Duc Ninh",
                    //                     phone_number: "01669709094",
                    //                     address: "Nam Dinh",
                    //                 }
                    //             })
                    //                 .spread(function (userResult, created) {

                    //                     userResult.setRoles([roleResult]);
                    //                     // if (created) {
                    //                     //   console.log("new user created");
                    //                     // }
                    //                     // else {
                    //                     //   console.log("user existed!");
                    //                     // }
                    //                 });
                    //         });
                });
        });
    }
}

module.exports = FakeDatabase;

