const jwt = require('jsonwebtoken');

const verifyRole = (allowedRoles) => (req, res, next) => {
  // Retrieve the JWT token from the HTTP-only cookie
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(403).send('Access token not found');
  }

  try {
    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    // Assuming the role is stored in the decoded token
    const { role } = decoded;

    if (!role || !allowedRoles.includes(role)) {
      return res
        .status(403)
        .send('You do not have permission to access this resource');
    }

    // If role is valid, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return res.status(401).send('Invalid token');
  }
};

module.exports = verifyRole;
