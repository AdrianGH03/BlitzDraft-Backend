const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  difficulty: String,
  token: String,
  gameData: Object,
  createdAt: { type: Date, default: Date.now, expires: '2h' },
  isCompleted: { type: Boolean, default: false },
  guesses: { type: Object, default: {} }, 
  cardsRevealed: { type: Array, default: [] },
  uuid: String
});

module.exports = mongoose.model('Game', GameSchema);