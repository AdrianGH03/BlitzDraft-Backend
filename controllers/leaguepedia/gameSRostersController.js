const leaguepediaClient = require('../../clients/leaguepediaClient');

async function gameStartingRosters(gameId){
    try {
        const response = await leaguepediaClient.get({
            action: 'cargoquery',
            format: 'json',
            tables: 'ScoreboardGames=SG',
            fields: 'SG.OverviewPage, SG.Team1, SG.Team2, SG.Tournament, SG.Team1Players, SG.Team2Players, SG.GameId',
            where: `SG.GameId='${gameId}'`,
        });
       
        //console.log('Leaguepedia response.cargoquery:', response);
        if (response.data.error) console.log('Leaguepedia response.error:', response.error);
       
        if (response.data.error && response.data.error.code === 'ratelimited') {
            const err = new Error('Rate limit exceeded');
            err.status = 429;
            throw err;
        }
      
        if (!response.data.cargoquery || !response.data.cargoquery[0]) {
            return null;
        }
        return response.data.cargoquery[0].title;
    } catch (error) {
        if (error.status === 429 || (error.response && error.response.status === 429)) {
            throw error; 
        }
        console.error('Error:', error);
        throw error;
    }
}

module.exports = { gameStartingRosters }