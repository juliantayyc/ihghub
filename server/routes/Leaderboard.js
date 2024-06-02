const express = require('express');
const router = express.Router();
const { Leaderboard } = require('../models');

const calculateTotalScores = async () => {
  const halls = [
    'Temasek Hall',
    'Kent Ridge Hall',
    'Eusoff Hall',
    'Sheares Hall',
    'Raffles Hall',
    'KEVII Hall',
  ];

  const hallMapping = {
    TH: 'Temasek Hall',
    KR: 'Kent Ridge Hall',
    EH: 'Eusoff Hall',
    SH: 'Sheares Hall',
    RH: 'Raffles Hall',
    KE: 'KEVII Hall',
  };

  const totals = {};

  for (const hall of halls) {
    totals[hall] = { M: 0, F: 0 };
  }

  const entries = await Leaderboard.findAll();

  entries.forEach((entry) => {
    const fullHallName = hallMapping[entry.hall];
    if (fullHallName && totals[fullHallName]) {
      totals[fullHallName][entry.sex] += entry.score;
    }
  });

  return totals;
};

router.get('/totals', async (req, res) => {
  try {
    const totals = await calculateTotalScores();
    res.json(totals);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/', async (req, res) => {
  await Leaderboard.findAll()
    .then((leaderboard) => {
      res.json(leaderboard);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post('/', async (req, res) => {
  const leaderboard = req.body;
  await Leaderboard.create(leaderboard)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Duplicate leaderboard entry' });
      } else {
        res.status(400).json(err);
      }
    });
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { hall, sex, score } = req.body;

  try {
    const leaderboard = await Leaderboard.findOne({ where: { id } });

    if (leaderboard) {
      leaderboard.hall = hall;
      leaderboard.sex = sex;
      leaderboard.score = score;

      await leaderboard.save();
      res.json({ message: 'Leaderboard updated successfully', leaderboard });
    } else {
      res.status(404).json({ message: 'Leaderboard not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the leaderboard' });
  }
});

module.exports = router;
