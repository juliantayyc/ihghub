module.exports = (sequelize, DataTypes) => {
  const Venues = sequelize.define(
    'Venues',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['name'],
        },
      ],
    }
  );

  Venues.associate = (models) => {
    Venues.hasMany(models.Fixtures, {
      foreignKey: 'venueId',
      as: 'fixtures',
    });
  };

  return Venues;
};
