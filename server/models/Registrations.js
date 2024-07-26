module.exports = (sequelize, DataTypes) => {
  const Registrations = sequelize.define(
    'Registrations',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nric: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hall: {
        type: DataTypes.ENUM('TH', 'EH', 'KR', 'SH', 'RH', 'KE'),
        allowNull: false,
      },
      matriculationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      medicalHistory: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      drugAllergies: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bloodType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parQ: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: false,
      },
      emergencyContactName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emergencyContactNumber: {
        type: DataTypes.STRING,
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
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['matriculationNumber', 'fixtureId'],
        },
      ],
    }
  );

  Registrations.associate = (models) => {
    Registrations.belongsTo(models.Fixtures, {
      foreignKey: 'fixtureId',
      as: 'fixtures',
    });
    Registrations.hasMany(models.LineUps, {
      foreignKey: 'registrationId',
      as: 'lineups',
    });
  };

  return Registrations;
};
