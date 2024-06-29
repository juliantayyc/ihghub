const express = require('express');
const router = express.Router();
const { Users, RefreshTokens } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createTokens = async (user, generateRefreshToken = false) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: '5m' }
  );

  let refreshToken = null;
  if (generateRefreshToken) {
    refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Find or create a refresh token for the user
    const [userToken, created] = await RefreshTokens.findOrCreate({
      where: { userId: user.id },
      defaults: {
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    // If the token already existed, update it
    if (!created) {
      await userToken.update({
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 86400000),
      });
    }
  }

  return { accessToken, refreshToken };
};

router.post('/signup', async (req, res) => {
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
  if (!user) return res.status(401).send('Username not found. Yet to sign up'); // Unauthorized

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send('Wrong Password'); // Unauthorized

  const { accessToken, refreshToken } = await createTokens(
    user,
    (generateRefreshToken = true)
  );

  console.log('refreshToken', refreshToken);
  console.log('accessToken', accessToken);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400000, // 1 day
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: false,
    sameSite: process.env.NODE_ENV === 'production' ? 'Lax' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 300000, // 5 minutes
  });

  res.json({
    success: `${username} is logged in!`,
  });
});

router.post('/refresh-token', async (req, res) => {
  console.log('cookies', req.cookies);

  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).send('Refresh token not found');
  }

  const storedToken = await RefreshTokens.findOne({ where: { refreshToken } });
  if (!storedToken) {
    return res.status(403).send('Invalid refresh token');
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        return res.status(403).send('Failed to verify refresh token');
      }

      const { accessToken } = await createTokens(user);

      res.cookie('accessToken', accessToken, {
        httpOnly: false,
        sameSite: process.env.NODE_ENV === 'production' ? 'Lax' : 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 300000, // 5 minutes
      });

      res.json({ accessToken });
    }
  );
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).send('No refresh token found');
  }

  // Delete the refresh token from the database
  await RefreshTokens.destroy({ where: { refreshToken } });

  // Clear the cookies
  res.cookie('refreshToken', '', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
  res.cookie('accessToken', '', {
    httpOnly: false,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });

  res.send('Logged out successfully');
});

module.exports = router;
