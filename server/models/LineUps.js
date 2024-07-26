module.exports = (sequelize, DataTypes) => {
  const LineUps = sequelize.define(
    'LineUps',
    {
      role: {
        type: DataTypes.ENUM('Starter', 'Substitute'),
        allowNull: false,
      },
      jerseyNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ivp: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: false,
      },
      fixtureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Fixtures',
          key: 'id',
        },
      },
      registrationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Registrations',
          key: 'id',
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['registrationId'],
        },
      ],
    }
  );

  LineUps.associate = (models) => {
    LineUps.belongsTo(models.Fixtures, {
      foreignKey: 'fixtureId',
      as: 'fixtures',
    });
    LineUps.belongsTo(models.Registrations, {
      foreignKey: 'registrationId',
      as: 'registrations',
    });
  };

  return LineUps;
};
