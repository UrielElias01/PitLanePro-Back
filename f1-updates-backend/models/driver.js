'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    name: DataTypes.STRING,
    team: DataTypes.STRING,
    nationality: DataTypes.STRING
  }, {});
  Driver.associate = function(models) {
    Driver.hasMany(models.Update);
  };
  return Driver;
};
