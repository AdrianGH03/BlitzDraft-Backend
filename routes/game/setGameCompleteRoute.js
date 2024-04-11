const express = require('express');
const router = express.Router();
const serverAccessMW = require('../../middleware/serverAccessMW.js');
const Game = require('../../models/MongoDB/Game.js');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200
});

function setGameComplete(req, res, next) {
  const token = req.params.token;

  Game.findOneAndUpdate({ token: token }, { isCompleted: true }, { new: true })
  .then(game => {
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({ message: 'Game completed' });
  })
  .catch(err => res.status(500).json({ error: err.message }));
}

function checkIsComplete(req, res, next) {
  const token = req.params.token;

  Game.findOne({ token: token })
  .then(game => {
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({ isCompleted: game.isCompleted });
  })
  .catch(err => res.status(500).json({ error: err.message }));
}



router.use(serverAccessMW, limiter);
router.put('/set-complete/:token', setGameComplete);
router.get('/is-complete/:token', checkIsComplete);

module.exports = router;

