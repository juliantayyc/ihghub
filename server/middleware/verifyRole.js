const jwt = require('jsonwebtoken');
const { Users } = require('../models'); // Adjust the path based on your project structure

const verifyRole = (allowedRoles) => async (req, res, next) => {
  // Retrieve the JWT token from the HTTP-only cookie
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(403).send('Access token not found');
  }

  try {
    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    // Assuming the role and email are stored in the decoded token
    const { role, email } = decoded;

    if (!role || !allowedRoles.includes(role)) {
      return res
        .status(403)
        .send('You do not have permission to access this resource');
    }

    // Check if the user is verified in the database
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Remove once verified admin in place!!!!
    // if (!user.isVerified) {
    //   return res.status(403).send('Email not verified');
    // }

    // If all checks pass, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return res.status(401).send('Invalid token');
  }
};

module.exports = verifyRole;
