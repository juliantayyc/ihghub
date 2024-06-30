require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);
app.use(cookieParser());

// Create Tables if not exist
const db = require('./models');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Backend Routes
const fixturesRouter = require('./routes/Fixtures');
app.use('/fixturesData', fixturesRouter);

const leaderboardRouter = require('./routes/Leaderboard');
app.use('/leaderboardData', leaderboardRouter);

const venuesRouter = require('./routes/Venues');
app.use('/venuesData', venuesRouter);

const authRouter = require('./routes/Auth');
app.use('/auth', authRouter);

const userRouter = require('./routes/Users');
app.use('/users', userRouter);

// Serve Client Routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
