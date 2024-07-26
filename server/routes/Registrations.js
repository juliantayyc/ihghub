const express = require('express');
const router = express.Router();
const { Fixtures, Registrations } = require('../models');

// Get all registrations with associated fixtures
router.get('/', async (req, res) => {
  try {
    const registrations = await Registrations.findAll({
      include: [
        {
          model: Fixtures,
          as: 'fixtures',
        },
      ],
    });

    res.json(registrations);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Create a new registration
router.post('/', async (req, res) => {
  const {
    name,
    nric,
    hall,
    matriculationNumber,
    dateOfBirth,
    medicalHistory,
    drugAllergies,
    bloodType,
    parQ,
    emergencyContactName,
    emergencyContactNumber,
    fixtureId,
  } = req.body;

  // Validate NRIC length
  if (nric.length !== 4) {
    return res
      .status(400)
      .json({ error: 'NRIC must be exactly 4 characters long.' });
  }

  try {
    const fixture = await Fixtures.findByPk(fixtureId);

    if (!fixture) {
      return res.status(400).json({ error: 'Fixture not found.' });
    }

    const newRegistration = await Registrations.create({
      name,
      nric,
      hall,
      matriculationNumber,
      dateOfBirth,
      medicalHistory,
      drugAllergies,
      bloodType,
      parQ,
      emergencyContactName,
      emergencyContactNumber,
      fixtureId,
    });

    res.status(201).json(newRegistration);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:fixtureId', async (req, res) => {
  const { fixtureId } = req.params;

  try {
    const fixture = await Fixtures.findByPk(fixtureId);

    if (!fixture) {
      return res.status(404).json({ error: 'Fixture not found.' });
    }

    const registrations = await Registrations.findAll({
      where: { fixtureId },
    });

    res.json(registrations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:fixtureId/:hall', async (req, res) => {
  const { fixtureId, hall } = req.params;

  try {
    const registrations = await Registrations.findAll({
      where: {
        fixtureId: fixtureId,
        hall: hall,
      },
    });
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get(
  '/findRegistration/:fixtureId/:matriculationNumber',
  async (req, res) => {
    const { fixtureId, matriculationNumber } = req.params;

    try {
      const registration = await Registrations.findOne({
        where: {
          fixtureId: fixtureId,
          matriculationNumber: matriculationNumber,
        },
      });

      if (registration) {
        res.json(registration);
      } else {
        res.status(404).json({ error: 'Registration not found.' });
      }
    } catch (error) {
      console.error('Error fetching registration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.put('/:fixtureId/:matriculationNumber', async (req, res) => {
  const { fixtureId, matriculationNumber } = req.params;
  const {
    name,
    nric,
    hall,
    dateOfBirth,
    medicalHistory,
    drugAllergies,
    bloodType,
    parQ,
    emergencyContactName,
    emergencyContactNumber,
  } = req.body;

  // Validate NRIC length
  if (nric && nric.length !== 4) {
    return res
      .status(400)
      .json({ error: 'NRIC must be exactly 4 characters long.' });
  }

  try {
    const registration = await Registrations.findOne({
      where: {
        fixtureId: fixtureId,
        matriculationNumber: matriculationNumber,
      },
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    registration.name = name || registration.name;
    registration.nric = nric || registration.nric;
    registration.hall = hall || registration.hall;
    registration.dateOfBirth = dateOfBirth || registration.dateOfBirth;
    registration.medicalHistory = medicalHistory || registration.medicalHistory;
    registration.drugAllergies = drugAllergies || registration.drugAllergies;
    registration.bloodType = bloodType || registration.bloodType;
    registration.parQ = parQ || registration.parQ;
    registration.emergencyContactName =
      emergencyContactName || registration.emergencyContactName;
    registration.emergencyContactNumber =
      emergencyContactNumber || registration.emergencyContactNumber;

    await registration.save();

    res.json({ message: 'Registration updated successfully', registration });
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
