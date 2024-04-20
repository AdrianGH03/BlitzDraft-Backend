

const axios = require('axios');
const getDifficultySettings = require('../../models/Game/difficultyModel.js').difficultySettings;
const User = require('../../models/MongoDB/User'); 

exports.gameCalculateScore = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is empty' });
    }

    const game_entries = req.body.gameData;
    const game_guesses = req.body.guesses;
    const game_difficulty = req.body.difficulty;
    const userInfo = req.body.userInfo; 

    if (!game_entries || !game_guesses || !game_difficulty) {
      return res.status(400).json({ message: 'Missing or empty parameters' });
    }

    const difficultySettings = getDifficultySettings[game_difficulty];

    let totalScore = 0;

    for (let key in game_entries) {
      if (key in game_guesses) {
        if (game_entries[key] === game_guesses[key]) {
          totalScore += difficultySettings.pointsPer;
        } else if ((key === 'Team1Pick2' && game_entries[key] === game_guesses['Team1Pick3']) ||
                   (key === 'Team1Pick3' && game_entries[key] === game_guesses['Team1Pick2']) ||
                   (key === 'Team1Pick4' && game_entries[key] === game_guesses['Team1Pick5']) ||
                   (key === 'Team1Pick5' && game_entries[key] === game_guesses['Team1Pick4']) ||
                   (key === 'Team2Pick1' && game_entries[key] === game_guesses['Team2Pick2']) ||
                   (key === 'Team2Pick2' && game_entries[key] === game_guesses['Team2Pick1'])) {
          totalScore += difficultySettings.pointsPer;
        }
      }
    }

    
    if (userInfo) {
      const user = await User.findById(userInfo._id);
      if (user) {
        user.points += totalScore;
        user.markModified('points'); 
        await user.save();
      }
    }

    res.json({ totalScore, outOf: difficultySettings.total });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};