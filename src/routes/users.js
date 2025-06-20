const express = require('express');
const router = express.Router();
const { auth, adminAuth, authorizeOwner } = require('../middleware/auth');
const { validate, userSchemas } = require('../middleware/validation');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUsers
} = require('../controllers/userController');

// All routes require authentication
router.use(auth);

// Get all users (admin only)
router.get('/', adminAuth, getUsers);

// Search users (admin only)
router.get('/search', adminAuth, searchUsers);

// Get single user
router.get('/:id', getUser);

// Update user (owner or admin)
router.put('/:id', validate(userSchemas.update), updateUser);

// Delete user (admin only, cannot delete self)
router.delete('/:id', adminAuth, deleteUser);

module.exports = router; 