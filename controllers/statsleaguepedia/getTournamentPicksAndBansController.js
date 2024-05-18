const axios = require('axios');
const allTournaments = require('../../models/Tournaments/tournament.js').tournaments;
const allPatches = require('../../models/Tournaments/tournament.js').patches;
const validator = require('validator');
const cache = {};

function generatePatchRange(patch) {
    if (patch.includes('-')) {
        const [start, end] = patch.split('-').map(Number);
        return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toFixed(1));
    }
    return [patch];
}
function customEscape(input) {
    let escaped = validator.escape(input);
    return escaped.replace(/&#x2F;/g, '/');
}

async function getChampPickBans(req, res){
    let tournament = req.body.tournament;
    let patch = req.body.patch;
    let side = req.body.side;
    if (typeof tournament !== 'string' || (patch && typeof patch !== 'string') || (side && typeof side !== 'string')) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    tournament = customEscape(tournament);
    patch = patch ? validator.escape(patch) : patch;
    side = side ? validator.escape(side) : side;

    

    const cacheKey = `${tournament}-${patch}-${side}`;

    if (cache[cacheKey]) {
        return res.json(cache[cacheKey]);
    }

    if (!Object.values(allTournaments).some(tournamentsArray => tournamentsArray.some(tournamentName => tournamentName === tournament))) {
        return res.status(400).json({ error: 'Invalid tournament' });
    }

    if (allPatches[tournament] && !allPatches[tournament].some(tournamentPatch => generatePatchRange(tournamentPatch.patchesPlayed).includes(patch))) {
        return res.status(400).json({ error: 'Invalid patch for the selected tournament' });
    }
    let championStats = {}; 
    let whereClause = `SG.Overviewpage='${tournament}'`;
    if (patch) {
        whereClause += ` AND SG.Patch='${patch}'`;
    }
    try {
        const response1 = await axios.get('https://lol.gamepedia.com/api.php', {
            params: {
                action: 'cargoquery',
                format: 'json',
                tables: 'ScoreboardGames=SG, Tournaments=T',
                fields: 'SG.DateTime_UTC, SG.Patch, SG.Winner, SG.OverviewPage, T.Name, T.OverviewPage, SG.Team1, SG.Team2, SG.Team1Picks, SG.Team2Picks, SG.Team1Bans, SG.Team2Bans',
                where: whereClause,
                limit: 500,
                join_on: "SG.OverviewPage=T.OverviewPage",
            }
        });
        if(!response1.data.cargoquery || Object.keys(response1.data).length == 0){
            return res.status(400).json({ error: 'No games found for selected parameters.' });
        }
        const numOfGames = response1.data.cargoquery.length;
        
        for (let game of response1.data.cargoquery) {
            let picks;
            let bans;
            if(side){
                picks = game.title[`${side}Picks`].split(',');
                bans = game.title[`${side}Bans`].split(',');
            } else {
                picks = game.title.Team1Picks.split(',').concat(game.title.Team2Picks.split(','));
                bans = game.title.Team1Bans.split(',').concat(game.title.Team2Bans.split(','));
            }

            let team1Picks = game.title.Team1Picks.split(',');
            let team2Picks = game.title.Team2Picks.split(',');
            const winner = game.title.Winner;

            for (let champion of picks) {
                if(champion == "None"){
                    continue;
                }
                if (champion in championStats) {
                    championStats[champion].picks++;
                } else {
                    championStats[champion] = {picks: 1, bans: 0, wins: 0, losses: 0};
                }
            }
            
            
            for (let champion of bans) {
                if(champion == "None"){
                    continue;
                }
                if (champion in championStats) {
                    championStats[champion].bans++;
                } else {
                    championStats[champion] = {picks: 0, bans: 1, wins: 0, losses: 0};
                }
            }

            
            for(let champion of picks){
                if(champion == "None"){
                    continue;
                }
                if(!(champion in championStats)){
                    championStats[champion] = {picks: 0, bans: 0, wins: 0, losses: 0};
                }
                if((winner == "1" && team1Picks.includes(champion)) || (winner == "2" && team2Picks.includes(champion))){
                    championStats[champion].wins++;
                } else {
                    championStats[champion].losses++;
                }
            }
            

        }

        for(champion in championStats){
            if(champion == "None"){
                continue;
            }
            championStats[champion].presence = Math.round((championStats[champion].picks + championStats[champion].bans) / numOfGames * 100);
        }
        for(champion in championStats){
            if(champion == "None"){
                continue;
            }
            championStats[champion].winrate = Math.round((championStats[champion].wins / championStats[champion].picks) * 100);
        }

        if(Object.keys(championStats).length == 0){
            return res.status(400).json({ error: 'No games found for selected parameters.' });
        }
        cache[cacheKey] = championStats;
        
        return res.json(championStats);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

module.exports = { getChampPickBans }