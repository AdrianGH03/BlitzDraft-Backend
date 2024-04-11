const jwt = require('jsonwebtoken');
const User = require('../../models/MongoDB/User');
require('dotenv').config();

exports.checkAuthentication = async (req, res) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.json({ isAuthenticated: false });
    }
    return res.json({ isAuthenticated: true });
  } catch (error) {
    return res.json({ isAuthenticated: false });
  }
};