const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const difficultySettings = require('../../models/Game/difficultyModel.js').difficultySettings;
const serverAccessMW = require('../../middleware/serverAccessMW.js');
const Game = require('../../models/MongoDB/Game.js');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50
});

router.use(serverAccessMW, limiter);


const algorithm = 'aes-256-cbc';
const secretKey = process.env.SUPER_SECRET_KEY_ROF_IP;
const secret = secretKey.slice(0, 32); // Replace with your own secret key
const iv = crypto.randomBytes(16); // Initialization vector

// Function to encrypt an IP address
function encrypt(text) {
  const hash = crypto.createHash('sha256');
  hash.update(text);
  const iv = hash.digest().slice(0, 16); // Use the first 16 bytes of the hash as the IV
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encrypted };
}

// Function to decrypt an IP address
function decrypt(iv, encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

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

  const { iv, encrypted: encryptedIp } = encrypt(req.ip);

  if (!gameData || Object.values(gameData).some(value => value == null)) {
    return res.status(400).json({ error: 'Invalid game data' });
  }

  Game.deleteMany({ ipAddress: encryptedIp, iv: iv })
    .then(() => {
      var newGameData = new Game({
        difficulty: difficulty,
        token: generateToken(),
        gameData: gameData,
        createdAt: Date.now(),
        isCompleted: false,
        guesses: {},
        cardsRevealed: [],
        ipAddress: encryptedIp,
        iv: iv
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