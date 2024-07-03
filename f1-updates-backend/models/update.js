'use strict';
module.exports = (sequelize, DataTypes) => {
  const Update = sequelize.define('Update', {
    userId: DataTypes.INTEGER,
    driverId: DataTypes.INTEGER,
    performance: DataTypes.STRING,
    trajectory: DataTypes.STRING
  }, {});
  Update.associate = function(models) {
    Update.belongsTo(models.User);
    Update.belongsTo(models.Driver);
  };
  return Update;
};
