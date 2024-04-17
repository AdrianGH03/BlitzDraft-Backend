const axios = require('axios');
const allTournaments = require('../../models/Tournaments/tournament.js').tournaments;



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function pickandbans(tournament){
    if (!Object.values(allTournaments).some(tournamentsArray => tournamentsArray.includes(tournament))) {
        throw new Error('Invalid tournament');
    }
    try {
        const response1 = await axios.get('https://lol.gamepedia.com/api.php', {
            params: {
                action: 'cargoquery',
                format: 'json',
                tables: 'PicksAndBansS7=PB, MatchSchedule=MS',
                fields: 'Team1PicksByRoleOrder, Team2PicksByRoleOrder, MS.Patch, MS.DateTime_UTC, MS.OverviewPage, PB.OverviewPage, PB.MatchId, PB.GameId, PB.Team1Ban1, PB.Team1Ban2, PB.Team1Ban3, PB.Team1Ban4, PB.Team1Ban5, PB.Team1Pick1, PB.Team1Pick2, PB.Team1Pick3, PB.Team1Pick4, PB.Team1Pick5, PB.Team2Ban1, PB.Team2Ban2, PB.Team2Ban3, PB.Team2Ban4, PB.Team2Ban5, PB.Team2Pick1, PB.Team2Pick2, PB.Team2Pick3, PB.Team2Pick4, PB.Team2Pick5, PB.Team1, PB.Team2, PB.Winner',
                where: `PB.OverviewPage='${tournament}'`,
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

            // Check if any of the picks or bans are null
            for(let i = 1; i <= 5; i++) {
                if(match[`Team1Pick${i}`] === null || match[`Team2Pick${i}`] === null || match[`Team1Ban${i}`] === null || match[`Team2Ban${i}`] === null) {
                    throw new Error('Invalid pick or ban');
                }
            }

            return {match: `${team1} vs ${team2}`, data: match}
        });

        const validGames = playedGames.filter(game => game.data.Winner != null);

        shuffle(validGames);
        
        const random10Games = validGames.slice(0, 10);
        const randomGame = random10Games[Math.floor(Math.random() * random10Games.length)];
        
        return randomGame;
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { pickandbans }
    
    
