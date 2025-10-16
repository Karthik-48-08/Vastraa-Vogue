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

    res.status(201).json({ message: 'User created successfully! Please log in.' });

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
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};