const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validate, authSchemas } = require('../middleware/validation');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');

// Public routes
router.post('/register', validate(authSchemas.register), register);
router.post('/login', validate(authSchemas.login), login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validate(authSchemas.register.partial()), updateProfile);
router.put('/change-password', auth, changePassword);

module.exports = router; 