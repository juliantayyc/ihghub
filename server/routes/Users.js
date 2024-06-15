const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { username, password, email } = req.body;

  // check if user exists
  const user = await Users.findOne({ where: { username: username } });
  if (user) {
    return res.json({ error: 'Username already exists' });
  }

  // hash pw and create user
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      email: email,
    })
      .then(() => {
        res.json('SUCCESS');
      })
      .catch((err) => {
        res.json({ error: 'Error creating user' });
      });
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (!user) res.json({ error: "User Doesn't Exist" });
  else
    bcrypt.compare(password, user.password).then((match) => {
      if (!match)
        res.json({ error: 'Wrong Username and Password Combination' });
      res.json('Logged In');
    });
});

module.exports = router;
