const express = require('express');
const router = express.Router();
const { Fixtures } = require('../models');
const { Op } = require('sequelize');
const OpenAI = require('openai');
const axios = require('axios');
const YOUTUBE_API_KEY = process.env.VITE_APP_YOUTUBE_API_KEY;

const fetchCaptions = async (videoId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const captionId = response.data.items[0]?.id;

    if (!captionId) {
      console.error('No captions found for this video.');
      return null;
    }

    const captionResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/captions/${captionId}?tfmt=srt&key=${YOUTUBE_API_KEY}`
    );
    return captionResponse.data;
  } catch (error) {
    console.error('Error fetching captions:', error);
    return null;
  }
};

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
    videoId,
    summary,
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
      fixture.videoId = videoId;
      fixture.summary = summary;

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
