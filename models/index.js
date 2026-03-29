'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Ép dùng cấu hình tùy chỉnh cho Shared Hosting (giới hạn 30 tiến trình)
const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  host: config.host || '127.0.0.1',
  pool: { 
    max: 1, 
    min: 0, 
    idle: 1000, // Đóng kết nối sau 1 giây nhàn rỗi để giải phóng suất
    acquire: 30000,
    evict: 1000 
  }
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
