const axios = require('axios');

async function gameStartingRosters(gameId){
    
    

    try {
        const response = await axios.get('https://lol.gamepedia.com/api.php', {
            params: {
                action: 'cargoquery',
                format: 'json',
                tables: 'ScoreboardGames=SG',
                fields: 'SG.OverviewPage, SG.Team1, SG.Team2, SG.Tournament, SG.Team1Players, SG.Team2Players, SG.GameId',
                where: `SG.GameId='${gameId}'`,
            }
        });

        return response.data.cargoquery[0].title;
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { gameStartingRosters }