const express = require('express');
const router = express.Router();
const { Fixtures } = require('../models');

router.get('/', async (req, res) => {
  await Fixtures.findAll()
    .then((fixtures) => {
      res.json(fixtures);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post('/', async (req, res) => {
  const fixture = req.body;
  await Fixtures.create(fixture)
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
