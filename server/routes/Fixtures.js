const express = require('express');
const router = express.Router();
const { Fixtures, Venues } = require('../models');
const verifyJWT = require('../middleware/verifyJWT');
const { Op } = require('sequelize');

router.get('/live', async (req, res) => {
  const now = new Date();
  const adjustedTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const adjustedStartTime = new Date(
    adjustedTime.getTime() + 0.25 * 60 * 60 * 1000
  );

  const currentDate = adjustedTime.toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

  await Fixtures.findAll({
    where: {
      date: currentDate,
      startTime: {
        [Op.lte]: adjustedStartTime,
      },
      endTime: {
        [Op.gte]: adjustedTime,
      },
    },
  })
    .then((fixtures) => {
      res.json(fixtures);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get('/', verifyJWT, async (req, res) => {
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

  try {
    const venues = await Venues.findAll();
    const validVenues = venues.map((venue) => venue.name);

    if (!validVenues.includes(fixture.venue)) {
      return res.status(400).json({
        error: `Invalid venue name. Valid venues are: ${validVenues.join(
          ', '
        )}`,
      });
    }

    const newFixture = await Fixtures.create(fixture);
    res.json(newFixture);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Duplicate fixture entry' });
    } else {
      res.status(400).json(err);
    }
  }
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
    videoId,
    summary,
  } = req.body;

  try {
    const venues = await Venues.findAll();
    const validVenues = venues.map((venue) => venue.name);

    if (!validVenues.includes(venue)) {
      return res.status(400).json({
        error: `Invalid venue name. Valid venues are: ${validVenues.join(
          ', '
        )}`,
      });
    }

    const fixture = await Fixtures.findOne({ where: { id } });

    if (fixture) {
      // Update all fields from request body
      fixture.sport = sport;
      fixture.sex = sex;
      fixture.team1 = team1;
      fixture.team2 = team2;
      fixture.score1 = score1;
      fixture.score2 = score2;
      fixture.venue = venue; // Update venue
      fixture.type = type;
      fixture.date = date;
      fixture.startTime = startTime;
      fixture.endTime = endTime;
      fixture.videoId = videoId;
      fixture.summary = summary;

      await fixture.save();
      res.json({ message: 'Fixture updated successfully', fixture });
    } else {
      res.status(404).json({ message: 'Fixture not found' });
    }
  } catch (error) {
    console.error('Error updating fixture:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the fixture' });
  }
});

router.get('/search', async (req, res) => {
  const { sport, sex, team1, team2, type, date } = req.query;

  try {
    const fixture = await Fixtures.findOne({
      where: {
        sport,
        sex,
        team1,
        team2,
        type,
        date,
      },
    });

    if (fixture) {
      res.json(fixture);
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching for the game' });
  }
});

router.get('/getfixture', async (req, res) => {
  const { sport, sex, team1, team2, type, venue, date, startTime, endTime } =
    req.query;

  try {
    const fixture = await Fixtures.findOne({
      where: {
        sport,
        sex,
        team1,
        team2,
        type,
        venue,
        date,
        startTime,
        endTime,
      },
    });

    if (fixture) {
      res.json(fixture);
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching for the game' });
  }
});

router.put('/:id/video', async (req, res) => {
  const id = req.params.id;
  const { videoId, summary } = req.body;

  try {
    const fixture = await Fixtures.findOne({ where: { id } });

    if (fixture) {
      fixture.videoId = videoId;
      fixture.summary = summary;

      await fixture.save();
      res.json({
        message: 'Video ID and summary updated successfully',
        fixture,
      });
    } else {
      res.status(404).json({ message: 'Fixture not found' });
    }
  } catch (error) {
    console.error('Error updating video ID, subtitles, and summary:', error);
    res.status(500).json({
      error:
        'An error occurred while updating the video ID, subtitles, and summary',
    });
  }
});

router.put('/:id/score', async (req, res) => {
  const id = req.params.id;
  const { score1, score2 } = req.body;

  try {
    const fixture = await Fixtures.findOne({ where: { id } });

    if (fixture) {
      fixture.score1 = score1;
      fixture.score2 = score2;

      await fixture.save();
      res.json({
        message: 'Scores updated successfully',
        fixture,
      });
    } else {
      res.status(404).json({ message: 'Fixture not found' });
    }
  } catch (error) {
    console.error('Error updating scores:', error);
    res.status(500).json({
      error: 'An error occurred while updating the scores',
    });
  }
});

module.exports = router;
