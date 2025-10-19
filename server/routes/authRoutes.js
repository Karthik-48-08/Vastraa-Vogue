const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for user signup
router.post('/signup', authController.signup);

// Route for user login
router.post('/login', authController.login);

// Route for Google authentication
router.post('/google-auth', authController.googleAuth);

module.exports = router;