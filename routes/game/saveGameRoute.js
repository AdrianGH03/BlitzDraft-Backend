const express = require('express');
const router = express.Router();
const serverAccessMW = require('../../middleware/serverAccessMW.js');
const Game = require('../../models/MongoDB/Game.js');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300
});

function saveGameGuessesAndCardsRevealed(req, res, next) {
  const { token, guesses, cardsRevealed } = req.body;

  Game.findOneAndUpdate({ token: token, isCompleted: false }, { guesses, cardsRevealed }, { new: true })
  .then(game => {
    if (!game) {
      return res.status(404).json({ error: 'Game not found or already completed' });
    }

    res.json({ message: 'Game updated' });
  })
  .catch(err => res.status(500).json({ error: err.message }));
}  

router.use(serverAccessMW, limiter);
router.put('/game-save', saveGameGuessesAndCardsRevealed);

module.exports = router;