module.exports = (sequelize, DataTypes) => {
  const Fixtures = sequelize.define(
    'Fixtures',
    {
      sport: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM('M', 'F', 'Mixed'),
        allowNull: false,
      },
      team1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      team2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      score2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('Prelims', 'Semis', 'Finals', 'Carnival'),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      videoId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      venueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Venues',
          key: 'id',
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['team1', 'team2', 'sport', 'sex', 'type'],
        },
      ],
    }
  );

  Fixtures.associate = (models) => {
    Fixtures.belongsTo(models.Venues, {
      foreignKey: 'venueId',
      as: 'venues',
    });
  };

  return Fixtures;
};
