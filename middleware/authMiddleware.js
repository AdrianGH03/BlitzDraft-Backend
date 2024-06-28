const jwt = require('jsonwebtoken');
const User = require('../models/MongoDB/User');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ error: 'You must be logged in.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'You must be logged in.' });
    }

    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};