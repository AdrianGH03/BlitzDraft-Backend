const jwt = require('jsonwebtoken');
const User = require('../../models/MongoDB/User');

exports.getUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ error: 'Missing or invalid token.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    console.log(user);
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }
    
    res.send({ user: user.toJSON() });
  } catch (error) {
    res.status(401).send({ error: 'Invalid token.' });
  }
};