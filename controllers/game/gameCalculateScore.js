

const axios = require('axios');
const getDifficultySettings = require('../../models/Game/difficultyModel.js').difficultySettings;


exports.gameCalculateScore = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is empty' });
    }

    const game_entries = req.body.gameData;
    const game_guesses = req.body.guesses;
    const game_difficulty = req.body.difficulty;

    if (!game_entries || !game_guesses || !game_difficulty) {
      return res.status(400).json({ message: 'Missing or empty parameters' });
    }

    let difficultySettings;
    if (game_difficulty === 'custom') {
      difficultySettings = req.body.difficultySettings;
      if (!difficultySettings) {
        return res.status(400).json({ message: 'Missing difficulty settings for custom difficulty' });
      }
    } else {
      difficultySettings = getDifficultySettings[game_difficulty];
    }

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


    res.json({ totalScore, outOf: difficultySettings.total });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};