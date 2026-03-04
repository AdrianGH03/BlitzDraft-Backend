const leaguepediaClient = require('../../clients/leaguepediaClient');


function sanitizeUrlParam(value) {
    return value.replace(/[^a-zA-Z0-9-_/.\s]/g, '');
}

async function getTeamImages(tournament, teams){
    tournament = sanitizeUrlParam(tournament);
    try {
        const response = await leaguepediaClient.get({
            action: 'cargoquery',
            format: 'json',
            tables: 'TournamentRosters=TR, Teams=T',
            fields: 'TR.Team, T.Image, T.OverviewPage',
            where: `TR.OverviewPage='${tournament}'`,
            join_on: 'TR.Team=T.OverviewPage'
        });
        
        if (!response.data || !response.data.cargoquery) {
            throw new Error('Unexpected API response');
        }
        const teamImageNames = response.data.cargoquery;
        const teamImages = {};

        const imagePromises = teamImageNames.map(async (team) => {
            
            if (teams.includes(team.title.Team)) {
                try {
                    const response = await leaguepediaClient.get({
                        action: 'query',
                        format: 'json',
                        prop: 'imageinfo',
                        iiprop: 'url',
                        titles: 'File:' + team.title.Image
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
                    if (error.status === 429 || (error.response && error.response.status === 429)) {
                        return res.status(429).json({ message: 'Rate limit exceeded. Please try again in a moment.' });
                    }
                    console.error('Error fetching image URL:', error.message);
                }
            }
        });

        
        await Promise.all(imagePromises);

        return teamImages;
    } catch (error) {
        if (error.status === 429 || (error.response && error.response.status === 429)) {
            return res.status(429).json({ message: 'Rate limit exceeded. Please try again in a moment.' });
        }
        console.error('Error:', error.message);
    }
}

module.exports = { getTeamImages }