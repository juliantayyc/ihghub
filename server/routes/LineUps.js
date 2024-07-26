const express = require('express');
const router = express.Router();
const { Fixtures, Registrations, LineUps } = require('../models');

// Get all LineUps with associated Fixtures and Registrations
router.get('/', async (req, res) => {
  try {
    const lineups = await LineUps.findAll({
      include: [
        {
          model: Fixtures,
          as: 'fixtures',
        },
        {
          model: Registrations,
          as: 'registrations',
        },
      ],
    });
    res.json(lineups);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  const { role, jerseyNumber, ivp, fixtureId, registrationId } = req.body;

  try {
    const lineUp = await LineUps.create({
      role,
      jerseyNumber,
      ivp,
      fixtureId,
      registrationId,
    });
    res.status(201).json(lineUp);
  } catch (error) {
    console.error('Error creating line-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:registrationId', async (req, res) => {
  const { role, jerseyNumber, ivp, fixtureId } = req.body;
  const { registrationId } = req.params;

  try {
    // Find the line-up by registrationId
    const lineUp = await LineUps.findOne({
      where: { registrationId, fixtureId },
    });

    if (!lineUp) {
      return res.status(404).json({ error: 'Line-up not found' });
    }

    // Update the line-up fields
    lineUp.role = role || lineUp.role;
    lineUp.jerseyNumber = jerseyNumber || lineUp.jerseyNumber;
    lineUp.ivp = ivp || lineUp.ivp;

    // Save the updated line-up
    await lineUp.save();

    res.status(200).json(lineUp);
  } catch (error) {
    console.error('Error updating line-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET route to fetch line-ups by fixture ID and hall
router.get('/:fixtureId', async (req, res) => {
  const { fixtureId } = req.params;

  try {
    // Fetch line-ups based on fixture ID and hall
    const lineUps = await LineUps.findAll({
      where: {
        fixtureId,
      },
      order: [
        ['role', 'ASC'], // Sort by role (starters first)
        ['ivp', 'DESC'], // Sort by IVP (Y first)
        ['jerseyNumber', 'ASC'], // Sort by jersey number
      ],
    });

    // Send the line-ups as a JSON response
    res.status(200).json(lineUps);
  } catch (error) {
    console.error('Error fetching line-ups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
