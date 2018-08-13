const fs = require("fs");
const path = require("path");
module.exports = {
  development: {
    database: "camera-app-db",
    username: "root",
    password: "23101994",
    dialect: "mysql",
    operatorsAliases: false,
    options: {
      host: "localhost",
      dialect: "mysql",
      port: 3306,
      // logging: console.log,
      logging: msg => {
        console.log(msg);
        msg += "\n";
        fs.appendFile("./logs/sql.query.log", msg, err => {});
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },

      define: {
        collate: "utf8_unicode_ci",
        charset: "utf8",
        dialectOptions: {
          collate: "utf8_general_ci"
        }
      },
      // similar for sync: you can define this to always force sync for models
      sync: { force: true },
      operatorsAliases: false // secure
    }
  },

  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
      host: process.env.DB_HOSTNAME,
      dialect: "mysql",
      port: 3306,
      logging: console.log,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        collate: "utf8_unicode_ci",
        charset: "utf8",
        dialectOptions: {
          collate: "utf8_general_ci"
        }
      },
      // similar for sync: you can define this to always force sync for models
      sync: { force: true },
      operatorsAliases: false // secure
    }
  }
};
