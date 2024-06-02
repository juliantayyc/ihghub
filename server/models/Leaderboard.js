module.exports = (sequelize, DataTypes) => {
  const Leaderboard = sequelize.define('Leaderboard', {
    hall: {
      type: DataTypes.ENUM('TH', 'EH', 'KR', 'KE', 'RH', 'SH'),
      allowNull: false,
    },
    sex: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Leaderboard;
};
