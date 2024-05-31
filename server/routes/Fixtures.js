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

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const {
    sport,
    sex,
    team1,
    team2,
    score1,
    score2,
    venue,
    type,
    date,
    startTime,
    endTime,
  } = req.body;

  try {
    const fixture = await Fixtures.findOne({ where: { id } });

    if (fixture) {
      fixture.sport = sport;
      fixture.sex = sex;
      fixture.team1 = team1;
      fixture.team2 = team2;
      fixture.score1 = score1;
      fixture.score2 = score2;
      fixture.venue = venue;
      fixture.type = type;
      fixture.date = date;
      fixture.startTime = startTime;
      fixture.endTime = endTime;

      await fixture.save();
      res.json({ message: 'Fixture updated successfully', fixture });
    } else {
      res.status(404).json({ message: 'Fixture not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the fixture' });
  }
});

module.exports = router;
