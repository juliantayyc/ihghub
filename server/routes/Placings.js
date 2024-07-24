const express = require('express');
const router = express.Router();
const { Placings } = require('../models');

router.get('/', async (req, res) => {
  await Placings.findAll()
    .then((placings) => {
      res.json(placings);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get('/search', async (req, res) => {
  const { sport, sex } = req.query;

  try {
    const placing = await Placings.findOne({
      where: {
        sport,
        sex,
      },
    });

    if (placing) {
      res.json(placing);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching for the entry' });
  }
});

router.post('/', async (req, res) => {
  const placing = req.body;
  await Placings.create(placing)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Duplicate placing entry' });
      } else {
        res.status(400).json(err);
      }
    });
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { first, second, third, fourth, fifth, sixth } = req.body;

  try {
    const placing = await Placings.findOne({ where: { id } });

    if (placing) {
      placing.first = first !== undefined ? first : placing.first;
      placing.second = second !== undefined ? second : placing.second;
      placing.third = third !== undefined ? third : placing.third;
      placing.fourth = fourth !== undefined ? fourth : placing.fourth;
      placing.fifth = fifth !== undefined ? fifth : placing.fifth;
      placing.sixth = sixth !== undefined ? sixth : placing.sixth;

      await placing.save();
      res.json({ message: 'Placing updated successfully', placing });
    } else {
      res.status(404).json({ message: 'Placing not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the placing' });
  }
});

const calculateTotalScores = async () => {
  const halls = ['TH', 'KR', 'EH', 'SH', 'RH', 'KE'];

  const hallMapping = {
    TH: 'Temasek Hall',
    KR: 'Kent Ridge Hall',
    EH: 'Eusoff Hall',
    SH: 'Sheares Hall',
    RH: 'Raffles Hall',
    KE: 'KEVII Hall',
  };

  // Define scores based on placement
  const scores = {
    regular: {
      first: 5,
      second: 4,
      third: 3,
      fourth: 3,
      fifth: 1,
      sixth: 1,
    },
    carnival: {
      first: 6,
      second: 5,
      third: 4,
      fourth: 3,
      fifth: 2,
      sixth: 1,
    },
  };

  const totals = {};

  for (const hall of halls) {
    totals[hallMapping[hall]] = { M: 0, F: 0 };
  }

  // Retrieve all entries from the Placings table
  const entries = await Placings.findAll();

  entries.forEach((entry) => {
    const addScore = (placement, score) => {
      if (entry[placement]) {
        if (entry.sex === 'Mixed') {
          totals[hallMapping[entry[placement]]]['M'] += score / 2;
          totals[hallMapping[entry[placement]]]['F'] += score / 2;
        } else {
          totals[hallMapping[entry[placement]]][entry.sex] += score;
        }
      }
    };

    const sportScores =
      entry.type === 'Carnival' ? scores.carnival : scores.regular;

    addScore('first', sportScores.first);
    addScore('second', sportScores.second);
    addScore('third', sportScores.third);
    addScore('fourth', sportScores.fourth);
    addScore('fifth', sportScores.fifth);
    addScore('sixth', sportScores.sixth);
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

module.exports = router;
