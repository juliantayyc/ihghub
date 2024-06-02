require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Create Tables if not exist
const db = require('./models');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Backend Routes
const fixturesRouter = require('./routes/Fixtures');
app.use('/fixturesData', fixturesRouter);

const leaderboardRouter = require('./routes/Leaderboard');
app.use('/leaderboardData', leaderboardRouter);

// Serve Client Routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
