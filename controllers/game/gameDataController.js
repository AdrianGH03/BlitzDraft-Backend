

const axios = require('axios');
const regions = require('../../models/Tournaments/tournament.js').regions;
const tournaments = require('../../models/Tournaments/tournament.js').tournaments;
const allTournaments = require('../../models/Tournaments/tournament.js').tournaments;
const getChampSplashes = require('../riotgames/champSplashesController.js').getChampSplashes;
const getTeamImages = require('../leaguepedia/teamImagesController.js').getTeamImages;
const getStartingRosters = require('../leaguepedia/gameSRostersController.js').gameStartingRosters;
const getPlayerImages = require('../leaguepedia/playerImagesController.js').getPlayerImages;
const getDifficultySettings = require('../../models/Game/difficultyModel.js').difficultySettings;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

exports.fetchAllGameData = async (req, res) => {
  try {
    const difficulty = req.query.difficulty || 'easy';
    const difficultySetting = getDifficultySettings[difficulty];

    const randomRegion = regions[Math.floor(Math.random() * regions.length)];
    const randomTournament = tournaments[randomRegion][Math.floor(Math.random() * tournaments[randomRegion].length)];

    if (!Object.values(allTournaments).some(tournamentsArray => tournamentsArray.includes(randomTournament))) {
      throw new Error('Invalid tournament');
    }

    const response1 = await axios.get('https://lol.gamepedia.com/api.php', {
      params: {
        action: 'cargoquery',
        format: 'json',
        tables: 'PicksAndBansS7=PB, MatchSchedule=MS',
        fields: 'Team1PicksByRoleOrder, Team2PicksByRoleOrder, MS.Patch, MS.DateTime_UTC, MS.OverviewPage, PB.OverviewPage, PB.MatchId, PB.GameId, PB.Team1Ban1, PB.Team1Ban2, PB.Team1Ban3, PB.Team1Ban4, PB.Team1Ban5, PB.Team1Pick1, PB.Team1Pick2, PB.Team1Pick3, PB.Team1Pick4, PB.Team1Pick5, PB.Team2Ban1, PB.Team2Ban2, PB.Team2Ban3, PB.Team2Ban4, PB.Team2Ban5, PB.Team2Pick1, PB.Team2Pick2, PB.Team2Pick3, PB.Team2Pick4, PB.Team2Pick5, PB.Team1, PB.Team2, PB.Winner',
        where: `PB.OverviewPage='${randomTournament}'`,
        limit: 500,
        join_on: "MS.OverviewPage=PB.OverviewPage, MS.MatchId=PB.MatchId",
        order_by: "MS.DateTime_UTC ASC"
      }
    });

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
    let randomGame;
    do {
      randomGame = random10Games[Math.floor(Math.random() * random10Games.length)];
    } while (Object.values(randomGame.data).includes('None'));

    const team1 = randomGame.data.Team1;
    const team2 = randomGame.data.Team2;
    const gameId = randomGame.data.GameId;

    const teamImages = await getTeamImages(randomTournament, [team1, team2]);
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
      tournament: randomTournament,
      region: randomRegion,
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