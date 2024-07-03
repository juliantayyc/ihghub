const jwt = require('jsonwebtoken');
const { RefreshTokens } = require('../models');
require('dotenv').config();

const refreshAccessToken = async (refreshToken) => {
  try {
    // Implement your logic to refresh the access token here
    // Example: Make a query to your database to refresh the token
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

  if (!authHeader) {
    return res.status(401).send('No Auth Header');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    // Check if token needs to be refreshed (e.g., nearing expiration)
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (decoded.exp - nowInSeconds < 60) {
      // If token is nearing expiration, refresh it
      const newAccessToken = await refreshAccessToken(req.cookies.refreshToken);
      req.user = jwt.decode(newAccessToken);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: false,
        sameSite: process.env.NODE_ENV === 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 300000, // 5 minutes
      });
    } else {
      // Token is valid, proceed with the decoded user information
      req.user = decoded;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send('Token expired');
    } else {
      return res.status(401).send('Invalid token');
    }
  }
};

module.exports = verifyJWT;
