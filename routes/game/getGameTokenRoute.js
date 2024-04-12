const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const difficultySettings = require('../../models/Game/difficultyModel.js').difficultySettings;
const serverAccessMW = require('../../middleware/serverAccessMW.js');
const Game = require('../../models/MongoDB/Game.js');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 //50
});

router.use(serverAccessMW, limiter);

// Function to generate a token
function generateToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Function to sanitize difficulty options
function sanitizeDifficulty(difficulty) {
  const allowedDifficulties = Object.keys(difficultySettings);
  return allowedDifficulties.includes(difficulty) ? difficulty : 'easy';
}

function returnModifiedGameData(req, res, next) {
  const gameData = req.body;
  const difficulty = sanitizeDifficulty(gameData.body.difficulty);

  // Get or generate UUID from cookies
  let uuid = req.cookies.uuid;
  if (!uuid) {
    uuid = uuidv4();
    res.cookie('uuid', uuid);
  }

  if (!gameData || Object.values(gameData).some(value => value == null)) {
    return res.status(400).json({ error: 'Invalid game data' });
  }

  Game.deleteMany({ uuid: uuid })
    .then(() => {
      var newGameData = new Game({
        difficulty: difficulty,
        token: generateToken(),
        gameData: gameData,
        createdAt: Date.now(),
        isCompleted: false,
        guesses: {},
        cardsRevealed: [],
        uuid: uuid
      });

      newGameData.save()
        .then(() => res.json(newGameData))
        .catch(err => res.status(500).json({ error: err.message }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
}

function getGameDataByToken(req, res, next) {
  const token = req.params.token;

  Game.findOne({ token: token })
    .then(game => {
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json({
        gameData: game.gameData,
        difficulty: game.difficulty,
        token: game.token,
        guesses: game.guesses,
        cardsRevealed: game.cardsRevealed,
        isCompleted: game.isCompleted,
      });
    })
    .catch(err => res.status(500).json({ error: err.message }));
}

router.post('/modified-game-data', returnModifiedGameData);
router.get('/get-game/:token', getGameDataByToken);

module.exports = router;