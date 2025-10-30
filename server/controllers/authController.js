const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP, testGmail } = require('../utils/emailService');

// Cache to store OTPs with timestamps
const otpStore = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// --- FORGOT PASSWORD LOGIC ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Clean and normalize the email
        const cleanEmail = email.trim().toLowerCase();
        console.log('📧 Received forgot password request for:', cleanEmail);

        // Basic email validation
        if (!cleanEmail || !cleanEmail.includes('@')) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        // Find user by email (case insensitive)
        const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } 
        });

        if (!user) {
            console.log('❌ User not found for email:', cleanEmail);
            // For security reasons, don't reveal if user exists or not
            return res.json({ message: 'If the email exists, OTP has been sent.' });
        }

        console.log('✅ User found:', user.email);

        // Generate OTP
        const otp = generateOTP();
        console.log('🔑 Generated OTP for email:', cleanEmail);
        
        // Store OTP with timestamp (valid for 5 minutes)
        otpStore.set(cleanEmail, {
            otp,
            timestamp: Date.now(),
            attempts: 0
        });

        try {
            console.log('🔄 Attempting to send OTP via Gmail...');
            // Send OTP via Gmail
            await sendOTP(cleanEmail, otp);
            console.log('✅ OTP sent successfully to:', cleanEmail);
            res.json({ 
                message: 'OTP sent successfully to your email.',
                provider: 'Gmail'
            });
        } catch (emailError) {
            console.error('❌ Email sending error:', emailError);
            // Remove the stored OTP if email fails
            otpStore.delete(cleanEmail);
            
            let errorMessage = 'Failed to send OTP. Please try again later.';
            
            if (emailError.code === 'EAUTH') {
                errorMessage = 'Email service authentication failed. Please check SMTP credentials.';
            } else if (emailError.code === 'ESOCKET') {
                errorMessage = 'Unable to connect to email service. Please check your internet connection.';
            }
            
            return res.status(500).json({ 
                message: errorMessage,
                details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
            });
        }

    } catch (error) {
        console.error("❌ Forgot Password Error:", error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};

// --- SIGNUP LOGIC ---
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    // Clean email before saving
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists (case insensitive)
    let existingUser = await User.findOne({ 
        email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create a new user with cleaned email
    const newUser = new User({ 
        firstName, 
        lastName, 
        email: cleanEmail, 
        mobile, 
        password 
    });
    
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

    // Clean the login identifier
    const cleanIdentifier = loginIdentifier.trim().toLowerCase();

    // Find user by email or phone number (case insensitive for email)
    const user = await User.findOne({ 
      $or: [
        { email: { $regex: new RegExp(`^${cleanIdentifier}$`, 'i') } }, 
        { mobile: cleanIdentifier }
      ] 
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

// --- VERIFY OTP LOGIC ---
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Clean email
        const cleanEmail = email.trim().toLowerCase();

        const storedOTPData = otpStore.get(cleanEmail);
        if (!storedOTPData) {
            return res.status(400).json({ message: 'OTP expired or not requested.' });
        }

        // Check if OTP is expired (5 minutes)
        if (Date.now() - storedOTPData.timestamp > 5 * 60 * 1000) {
            otpStore.delete(cleanEmail);
            return res.status(400).json({ message: 'OTP expired.' });
        }

        // Verify OTP
        if (storedOTPData.otp !== otp) {
            storedOTPData.attempts += 1;
            if (storedOTPData.attempts >= 3) {
                otpStore.delete(cleanEmail);
                return res.status(400).json({ message: 'Too many incorrect attempts. Please request a new OTP.' });
            }
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // OTP verified successfully
        otpStore.delete(cleanEmail);
        
        // Generate a temporary token for password reset
        const tempToken = jwt.sign({ email: cleanEmail }, process.env.JWT_SECRET, { expiresIn: '5m' });
        res.json({ message: 'OTP verified successfully.', tempToken });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};

// --- RESET PASSWORD LOGIC ---
exports.resetPassword = async (req, res) => {
    try {
        const { tempToken, newPassword } = req.body;

        // Verify temp token
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password reset successful.' });

    } catch (error) {
        console.error("Password Reset Error:", error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};

// --- GOOGLE REGISTRATION/LOGIN ---
exports.googleAuth = async (req, res) => {
  try {
    const { uid, email, firstName, lastName } = req.body;

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Create new user for Google sign-in (generate random password)
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      user = new User({
        firstName,
        lastName,
        email: cleanEmail,
        mobile: `google-${uid}`,
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