const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('No Auth Header');
  }
  console.log(authHeader); // Bearer <token>
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid Token'); // invalid token
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
