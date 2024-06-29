module.exports = (sequelize, DataTypes) => {
  const RefreshTokens = sequelize.define('RefreshTokens', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  RefreshTokens.associate = (models) => {
    RefreshTokens.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return RefreshTokens;
};
