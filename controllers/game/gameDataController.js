

const axios = require('axios');
const regions = require('../../models/Tournaments/tournament.js').regions;
const allTournaments = require('../../models/Tournaments/tournament.js').tournaments;
const getChampSplashes = require('../riotgames/champSplashesController.js').getChampSplashes;
const getTeamImages = require('../leaguepedia/teamImagesController.js').getTeamImages;
const getStartingRosters = require('../leaguepedia/gameSRostersController.js').gameStartingRosters;
const getPlayerImages = require('../leaguepedia/playerImagesController.js').getPlayerImages;
const getDifficultySettings = require('../../models/Game/difficultyModel.js').difficultySettings;
const order = require('../../models/Game/difficultyModel.js').order;
const { body, validationResult } = require('express-validator');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}



exports.validateFetchAllGameData = [
  body('difficulty')
    .trim()
    .isIn(['easy', 'medium', 'hard', 'custom'])
    .withMessage('Invalid difficulty'),
  body('startPick')
    .optional({ checkFalsy: true })
    .trim()
    .isIn(order)
    .withMessage('Invalid startPick'),
  body('tournament')
    .trim()
    .matches(/^[a-z0-9/ \-]+$/i)
    .withMessage('Invalid tournament'),
  body('patch')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-z0-9.]+$/i)
    .withMessage('Invalid patch'),
];

exports.fetchAllGameData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const difficulty = req.body.difficulty;
    const startPick = req.body.startPick;


    let difficultySetting;
    if (difficulty === 'custom') {
      const startPickIndex = order.indexOf(startPick);
      if (startPickIndex === -1) {
        return res.status(400).json({ error: 'Invalid startPick' });
      }

      difficultySetting = {
        total: (order.length - startPickIndex) * 10,
        pointsPer: 10, 
        pickBanCards: order.slice(0, startPickIndex).length,
        order: order,
        cardsRevealed: order.slice(0, startPickIndex),
      };
      
    } else {
      difficultySetting = getDifficultySettings[difficulty];
    }

    const tournament = req.body.tournament;
    const patch = req.body.patch;

    if (!Object.values(allTournaments).some(tournamentsArray => tournamentsArray.some(tournamentName => tournamentName === tournament))) {
        return res.status(400).json({ error: 'Invalid tournament' });
    }
    let whereClause = `PB.OverviewPage='${tournament}'`;
    if (patch) {
        whereClause += ` AND MS.Patch='${patch}'`;
    }
    let region;
    for (const [key, value] of Object.entries(allTournaments)) {
      if (value.includes(tournament)) {
        region = key;
        break;
      }
    }

    if (!region) {
      return res.status(400).json({ error: 'Invalid tournament' });
    }

    const response1 = await axios.get('https://lol.gamepedia.com/api.php', {
      params: {
        action: 'cargoquery',
        format: 'json',
        tables: 'PicksAndBansS7=PB, MatchSchedule=MS',
        fields: 'Team1PicksByRoleOrder, Team2PicksByRoleOrder, MS.Patch, MS.DateTime_UTC, MS.OverviewPage, PB.OverviewPage, PB.MatchId, PB.GameId, PB.Team1Ban1, PB.Team1Ban2, PB.Team1Ban3, PB.Team1Ban4, PB.Team1Ban5, PB.Team1Pick1, PB.Team1Pick2, PB.Team1Pick3, PB.Team1Pick4, PB.Team1Pick5, PB.Team2Ban1, PB.Team2Ban2, PB.Team2Ban3, PB.Team2Ban4, PB.Team2Ban5, PB.Team2Pick1, PB.Team2Pick2, PB.Team2Pick3, PB.Team2Pick4, PB.Team2Pick5, PB.Team1, PB.Team2, PB.Winner',
        where: whereClause,
        limit: 500,
        join_on: "MS.OverviewPage=PB.OverviewPage, MS.MatchId=PB.MatchId",
        order_by: "MS.DateTime_UTC ASC"
      }
    });
    
    if(!response1.data.cargoquery || response1.data.cargoquery.length == 0){
      return res.status(400).json({ error: 'No games found for selected parameters.' });
    }

    const playedGames = response1.data.cargoquery
      .filter(game => game.title.MatchId)
      .map(game => {
        const team1 = game.title.Team1
        const team2 = game.title.Team2
        const match = game.title

        return {match: `${team1} vs ${team2}`, data: match}
      });

    const validGames = playedGames.filter(game => game.data.Winner != null);

    shuffle(validGames);

    const random10Games = validGames.slice(0, 10);
    if (!random10Games.some(game => !Object.values(game.data).includes('None'))) {
      return res.status(400).json({ error: 'No valid games found.' });
    }
    
    let randomGame;
    do {
      randomGame = random10Games[Math.floor(Math.random() * random10Games.length)];
    } while (Object.values(randomGame.data).includes('None'));

    const team1 = randomGame.data.Team1;
    const team2 = randomGame.data.Team2;
    const gameId = randomGame.data.GameId;

    const teamImages = await getTeamImages(tournament, [team1, team2]);
    const startingRosters = await getStartingRosters(gameId);
    const rosterTeam1 = startingRosters.Team1;
    const rosterTeam2 = startingRosters.Team2;
    const team1Players = startingRosters.Team1Players;
    const team2Players = startingRosters.Team2Players;


   
    const allPlayers = team1Players.concat(team2Players);

    
    const playerImagesTeam1 = await getPlayerImages(team1Players);
    const playerImagesTeam2 = await getPlayerImages(team2Players);

    Object.values(playerImagesTeam1).forEach(value => {
      if(value === null) {
        throw new Error('Invalid player image in team 1');
      }
    });
    
    Object.values(playerImagesTeam2).forEach(value => {
      if(value === null) {
        throw new Error('Invalid player image in team 2');
      }
    });
    const playerImages = { 
      [rosterTeam1]: playerImagesTeam1, 
      [rosterTeam2]: playerImagesTeam2 
    };

    const champsObject = {
        Team1Pick1: randomGame.data.Team1Pick1,
        Team1Pick2: randomGame.data.Team1Pick2,
        Team1Pick3: randomGame.data.Team1Pick3,
        Team1Pick4: randomGame.data.Team1Pick4,
        Team1Pick5: randomGame.data.Team1Pick5,
        Team2Pick1: randomGame.data.Team2Pick1,
        Team2Pick2: randomGame.data.Team2Pick2,
        Team2Pick3: randomGame.data.Team2Pick3,
        Team2Pick4: randomGame.data.Team2Pick4,
        Team2Pick5: randomGame.data.Team2Pick5,
        Team1Ban1: randomGame.data.Team1Ban1,
        Team1Ban2: randomGame.data.Team1Ban2,
        Team1Ban3: randomGame.data.Team1Ban3,
        Team1Ban4: randomGame.data.Team1Ban4,
        Team1Ban5: randomGame.data.Team1Ban5,
        Team2Ban1: randomGame.data.Team2Ban1,
        Team2Ban2: randomGame.data.Team2Ban2,
        Team2Ban3: randomGame.data.Team2Ban3,
        Team2Ban4: randomGame.data.Team2Ban4,
        Team2Ban5: randomGame.data.Team2Ban5
      };

      const champSplashes = await getChampSplashes(champsObject);


    
    const allData = {
      tournament: tournament,
      region: region,
      game: randomGame,
      champSplashes: champSplashes,
      difficultySettings: difficultySetting,
      difficulty: difficulty,
      teamImages,
      startingRosters,
      playerImages
    };

    
    res.json(allData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};