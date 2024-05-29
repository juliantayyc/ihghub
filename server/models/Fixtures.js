module.exports = (sequelize, DataTypes) => {
  const Fixtures = sequelize.define('Fixtures', {
    Sport: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false,
    },
    Team1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Team2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Score1: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Score2: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  });

  return Fixtures;
};
