const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRole = require('../middleware/verifyRole');

const adminPermissions = ['admin'];

// Get all users
router.get(
  '/all',
  verifyJWT,
  verifyRole(adminPermissions),
  async (req, res) => {
    try {
      const users = await Users.findAll();
      res.json(users);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

// Update user role
router.put(
  '/role/:id',
  verifyJWT,
  verifyRole(adminPermissions),
  async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
      const user = await Users.findByPk(id);
      if (user) {
        user.role = role;
        await user.save();
        res.json({ message: 'User role updated successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

module.exports = router;
