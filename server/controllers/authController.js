const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- SIGNUP LOGIC ---
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create a new user (password will be hashed by the model's pre-save hook)
    const newUser = new User({ firstName, lastName, email, mobile, password });
    await newUser.save();

    // Generate JWT token for immediate login
    const payload = { userId: newUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ 
      message: 'User created successfully!',
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};

// --- LOGIN LOGIC ---
exports.login = async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    // Find user by email or phone number
    const user = await User.findOne({ 
      $or: [{ email: loginIdentifier }, { mobile: loginIdentifier }] 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // If passwords match, create a secure JSON Web Token (JWT)
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send the token and user info back to the frontend
    res.status(200).json({ 
      token, 
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// --- GOOGLE REGISTRATION/LOGIN ---
exports.googleAuth = async (req, res) => {
  try {
    const { uid, email, firstName, lastName } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user for Google sign-in (generate random password)
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      user = new User({
        firstName,
        lastName,
        email,
        mobile: `google-${uid}`, // Unique mobile for Google users
        password: randomPassword
      });
      await user.save();
    }

    // Generate JWT token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: 'Server error during Google authentication.' });
  }
};