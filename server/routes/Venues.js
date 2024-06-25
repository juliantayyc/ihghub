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
        res.status(400).json({ error: 'Duplicate fixture entry' });
      } else {
        res.status(400).json(err);
      }
    });
});

module.exports = router;
