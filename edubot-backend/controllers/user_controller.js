const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/user'); // You will need to create this model

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    // Check if user exists by username
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists.' });
    }
    // Check if user exists by email (if email provided)
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ error: 'Email already in use.' });
      }
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, email });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    // Allow login by username or email
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    // Generate JWT
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
}; 