const axios = require('axios');


function sanitizeUrlParam(value) {
    return value.replace(/[^a-zA-Z0-9-_/.\s]/g, '');
}

async function getTeamImages(tournament, teams){
    tournament = sanitizeUrlParam(tournament);
    try {
        const response = await axios.get('https://lol.gamepedia.com/api.php', {
            params: {
                action: 'cargoquery',
                format: 'json',
                tables: 'TournamentRosters=TR, Teams=T',
                fields: 'TR.Team, T.Image, T.OverviewPage',
                where: `TR.OverviewPage='${tournament}'`,
                join_on: 'TR.Team=T.OverviewPage'
            }
        });

        if (!response.data || !response.data.cargoquery) {
            throw new Error('Unexpected API response');
        }
        const teamImageNames = response.data.cargoquery;
        const teamImages = {};

        const imagePromises = teamImageNames.map(async (team) => {
            
            if (teams.includes(team.title.Team)) {
                try {
                    const response = await axios.get('https://lol.gamepedia.com/api.php', {
                        params: {
                            action: 'query',
                            format: 'json',
                            prop: 'imageinfo',
                            iiprop: 'url',
                            titles: 'File:' + team.title.Image
                        },
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    if (!response.data || !response.data.query || !response.data.query.pages) {
                        throw new Error('Unexpected API response');
                    }
                    const pages = response.data.query.pages;
                    for (const p in pages) {
                        if (pages[p].imageinfo) {
                            let imageUrl = pages[p].imageinfo[0].url;
                            imageUrl = imageUrl.split('.png')[0] + '.png';
                            teamImages[team.title.Team] = imageUrl; 
                        }
                    }
                } catch (error) {
                    console.error('Error fetching image URL:', error.message);
                }
            }
        });

        
        await Promise.all(imagePromises);

        return teamImages;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = { getTeamImages }