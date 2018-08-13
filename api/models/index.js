"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__dirname);
const env = process.env.NODE_ENV || "development";
const config = require("../../config/database.config")[env];
const db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config.options);
}

fs.readdirSync(__dirname).filter(folder => {
  let dir = path.join(__dirname, folder);
  if (folder != "index.js")
    fs
      .readdirSync(dir)
      .filter(file => {
        return file;
      })
      .forEach(file => {
        let model = sequelize["import"](path.join(dir, file));
        db[model.name] = model;
      });
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
