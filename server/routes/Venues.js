const express = require('express');
const router = express.Router();
const { Venues } = require('../models');

router.get('/', async (req, res) => {
  await Venues.findAll()
    .then((venues) => {
      res.json(venues);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get('/getvenue', async (req, res) => {
  const { name } = req.query;

  try {
    const venue = await Venues.findOne({
      where: {
        name,
      },
    });

    if (venue) {
      res.json(venue);
    } else {
      res.status(404).json({ message: 'Venue not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching for the venue' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  await Venues.findByPk(id)
    .then((venue) => {
      if (venue) {
        res.json(venue);
      } else {
        res.status(404).json({ error: 'Venue not found' });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post('/', async (req, res) => {
  const venues = req.body;
  await Venues.create(venues)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Duplicate venue entry' });
      } else {
        res.status(400).json(err);
      }
    });
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, location, latitude, longitude } = req.body;

  try {
    const venue = await Venues.findOne({ where: { id } });

    if (venue) {
      // Update all fields from request body
      venue.name = name;
      venue.location = location;
      venue.latitude = latitude;
      venue.longitude = longitude;

      await venue.save();
      res.json({ message: 'Venue updated successfully', venue });
    } else {
      res.status(404).json({ message: 'Venue not found' });
    }
  } catch (error) {
    console.error('Error updating Venue:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the Venue' });
  }
});

module.exports = router;
