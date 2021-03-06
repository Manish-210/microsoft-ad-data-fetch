'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var config = require('../config/sequelize');
var db = {};

var sequelize = config;
//Create a Sequelize connection to the database using the URL in config/config.js
//Load all the models
fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(function (file) {
    if (file != 'sshIndex.js') {
      const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes
      );

      db[model.name] = model;
    }
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Export the db Object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
