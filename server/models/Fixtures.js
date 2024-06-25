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
      venue: {
        type: DataTypes.STRING,
        allowNull: false,
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

  Fixtures.addHook('beforeValidate', async (fixture, options) => {
    const { Venues } = require('../models'); // Adjust the path to your models
    const venues = await Venues.findAll();
    const validVenues = venues.map((venue) => venue.name);

    if (!validVenues.includes(fixture.venue)) {
      throw new Error(
        `Invalid venue name: ${
          fixture.venue
        }. Valid venues are: ${validVenues.join(', ')}`
      );
    }
  });

  return Fixtures;

  return Fixtures;
};
