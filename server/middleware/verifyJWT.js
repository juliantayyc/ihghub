const jwt = require('jsonwebtoken');
const axios = require('axios');
const { RefreshTokens } = require('../models');
require('dotenv').config();

const refreshAccessToken = async (refreshToken) => {
  try {
    const { data } = await axios.post(
      `${process.env.VITE_APP_SERVER_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    return data.accessToken;
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

  jwt.verify(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          try {
            const accessToken = await refreshAccessToken(
              req.cookies.refreshToken
            );
            req.user = jwt.decode(accessToken);
            res.cookie('accessToken', accessToken, {
              httpOnly: false,
              sameSite: process.env.NODE_ENV === 'Lax',
              secure: process.env.NODE_ENV === 'production',
              maxAge: 300000, // 5 minutes
            });
            next();
          } catch (error) {
            return res.status(401).send('Failed to refresh access token');
          }
        } else {
          return res.status(401).send('Invalid Token');
        }
      } else {
        req.user = decoded;
        next();
      }
    }
  );
};

module.exports = verifyJWT;
