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
          fields: ['name', 'nric', 'hall', 'fixtureId'],
        },
      ],
    }
  );

  Registrations.associate = (models) => {
    Registrations.belongsTo(models.Fixtures, {
      foreignKey: 'fixtureId',
      as: 'fixtures',
    });
  };

  return Registrations;
};
