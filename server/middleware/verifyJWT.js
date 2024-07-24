const jwt = require('jsonwebtoken');
const { RefreshTokens } = require('../models');
require('dotenv').config();

const refreshAccessToken = async (refreshToken) => {
  try {
    const storedToken = await RefreshTokens.findOne({
      where: { refreshToken },
    });
    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = jwt.sign(
      {
        id: storedToken.userId,
        username: storedToken.username,
        email: storedToken.email,
        role: storedToken.role,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' }
    );

    return newAccessToken;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.cookies.accessToken;

  if (!authHeader) {
    return res.status(401).send('No Auth Header');
  }

  if (!refreshToken) {
    return res.status(401).send('No refresh token');
  }

  if (!accessToken) {
    try {
      const newAccessToken = await refreshAccessToken(refreshToken);
      req.user = jwt.decode(newAccessToken);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: false,
        sameSite: process.env.NODE_ENV === 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 300000, // 5 minutes
      });
      return next();
    } catch (error) {
      return res.status(401).send('Unable to refresh access token');
    }
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        req.user = jwt.decode(newAccessToken);
        res.cookie('accessToken', newAccessToken, {
          httpOnly: false,
          sameSite: process.env.NODE_ENV === 'Lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 300000, // 5 minutes
        });
        next();
      } catch (refreshError) {
        return res.status(401).send('Unable to refresh access token');
      }
    } else {
      return res.status(401).send('Invalid token');
    }
  }
};

module.exports = verifyJWT;
