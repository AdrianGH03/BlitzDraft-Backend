const User = require('../../models/MongoDB/User');
const jwt = require('jsonwebtoken');
const createFilter = require('../../other/filters');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const validator = require('validator');


const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return null;
};


const checkProfanity = (username, password, filter) => {
  if (filter.isProfane(username.toLowerCase()) || filter.isProfane(password.toLowerCase())) {
    return { error: `${username} is not allowed` };
  }
  return null;
};


const checkExistingUser = async (username, email) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return { error: 'Username already in use.' };
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return { error: 'Email already in use.' };
  }
  return null;
};


const validateCredentials = (username, password, email) => {
  if (username.length < 3 || username.length > 20) {
    return { error: 'Username must be between 3 and 20 characters.' };
  }
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username)) {
    return { error: 'Username must contain only letters and numbers.' };
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]{8,20}$/;
  if (!passwordRegex.test(password)) {
    return { error: 'Password must be between 8 and 20 characters, contain at least one uppercase letter, one number, and one special character.' };
  }
  const emailRegex = /^[^\s@]+@(?:gmail\.com|outlook\.com|yahoo\.com|hotmail\.com|aol\.com|icloud\.com|protonmail\.com)$/;
  if (!emailRegex.test(email)) {
    return { error: 'Email must come from a valid provider (i.e. gmail, aol, yahoo, etc.)' };
  }
  return null;
};


const createTokens = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { token, refreshToken };
};


exports.signup = async (req, res) => {
  const validationError = validateRequest(req, res);
  if (validationError) return validationError;
  

  const filter = await createFilter();
  const { username, password, email } = req.body;

  const sanitizedUsername = validator.escape(username);
  const sanitizedPassword = validator.escape(password);
  const sanitizedEmail = validator.escape(email);

  if(sanitizedUsername == '' || sanitizedPassword == '' || sanitizedEmail == '') return res.status(400).send({ error: 'Please fill in all fields' });

  const profanityError = checkProfanity(sanitizedUsername, sanitizedPassword, filter);
  if (profanityError) return res.status(400).send(profanityError);

  const existingUserError = await checkExistingUser(sanitizedUsername, sanitizedEmail);
  if (existingUserError) return res.status(400).send(existingUserError);

  const credentialsError = validateCredentials(sanitizedUsername, sanitizedPassword, sanitizedEmail);
  if (credentialsError) return res.status(400).send(credentialsError);

  const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
  const user = new User({ username: sanitizedUsername, password: hashedPassword, email: sanitizedEmail });
  await user.save();

  const { token, refreshToken } = createTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 3 * 60 * 60 * 1000 // 3 hours
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  res.send({ status: 'Success' });
};


exports.login = async (req, res) => {
  const validationError = validateRequest(req, res);
  if (validationError) return validationError;

  const { username, password } = req.body;
  const sanitizedUsername = validator.escape(username);
  const sanitizedPassword = validator.escape(password);

  
  const user = await User.findOne({ username: sanitizedUsername });
  if (!user) {
    return res.status(422).send({ error: 'Invalid password or username' });
  }

  const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
  if (!isMatch) {
    return res.status(422).send({ error: 'Invalid password or username' });
  }

  const { token, refreshToken } = createTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('token', token, { 
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 3 * 60 * 60 * 1000
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.send({ status: 'Success' });
};


exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).send({ error: 'Something went wrong...' });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(400).send({ error: 'Something went wrong...' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'Something went wrong...' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { 
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 3 * 60 * 60 * 1000
    });
    res.send({ status: 'Success' });
  });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.send({ status: 'Success' });
};