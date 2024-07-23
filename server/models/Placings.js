module.exports = (sequelize, DataTypes) => {
  const Placings = sequelize.define(
    'Placings',
    {
      sport: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM('M', 'F', 'Mixed'),
        allowNull: false,
      },
      first: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      second: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      third: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fourth: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fifth: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sixth: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['sport', 'sex'],
        },
      ],
    }
  );

  return Placings;
};
