require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Create Tables if not exist
const db = require('./models');

// Routers
const fixturesRouter = require('./routes/Fixtures');
app.use('/fixtures', fixturesRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
});
