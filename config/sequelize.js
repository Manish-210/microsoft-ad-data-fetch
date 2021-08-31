const Sequelize = require('sequelize');
const {DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT} = require("./config");

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  logging: console.log,
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT
});

module.exports = sequelize;