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

module.exports = router;
