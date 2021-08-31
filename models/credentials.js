const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'credentials',
    {
      emailId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      dataSourceType: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      credentials: {
        type: DataTypes.STRING(3000),
        allowNull: false,
      },
      authId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: 'credentials',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'authId' }],
        },
      ],
    }
  );
};
