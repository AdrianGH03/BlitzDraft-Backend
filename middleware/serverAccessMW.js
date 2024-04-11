// serverAccessMW.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.headers['x-server-token'];
  const secret = req.headers['x-server-secret'];
  
  if(token !== process.env.SERVER_TOKEN && secret !== process.env.SERVER_SECRET) return res.status(403).send('Invalid access');
  if (token == process.env.SERVER_TOKEN && secret == process.env.SERVER_SECRET) {
    const jwtToken = jwt.sign({ server: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('serverToken', jwtToken, { httpOnly: true });
    next();  
  } else {
    res.status(403).send('Invalid server token');
  }
};