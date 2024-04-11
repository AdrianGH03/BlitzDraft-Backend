const axios = require('axios');
const sanitize = require('sanitize-filename');

async function getPlayerImages(allPlayers){
    allPlayers = allPlayers.split(',').map(player => sanitize(player));
    const playerImages = await Promise.all(allPlayers.map(async (player) => {
        try{
            const response = await axios.get('https://lol.gamepedia.com/api.php', {
            params: {
                action: 'cargoquery',
                format: 'json',
                tables: 'PlayerImages=P',
                fields: 'P.FileName, P.Link',
                where: `P.Link='${player}'`,
            }
            });
            if (!response.data || !response.data.cargoquery) {
                throw new Error('Unexpected API response');
            }
            const imagesByYear = {};
            for(let index in response.data.cargoquery){
                const fileName = response.data.cargoquery[index].title.FileName;
                const yearMatch = fileName.match(/\d{4}/); 
                if (yearMatch) {
                    const year = yearMatch[0];
                    if(imagesByYear[year]){
                        imagesByYear[year].push(fileName);
                    }else{
                        imagesByYear[year] = [fileName];
                    }
                }
            }
            
            const years = Object.keys(imagesByYear).sort();
            const latestYear = years[years.length - 1];
            const latestYearImages = imagesByYear[latestYear][imagesByYear[latestYear].length - 1];

            
            const imageUrlResponse = await axios.get('https://lol.gamepedia.com/api.php', {
                params: {
                    action: 'query',
                    format: 'json',
                    prop: 'imageinfo',
                    iiprop: 'url',
                    titles: 'File:' + latestYearImages
                },
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (!imageUrlResponse.data || !imageUrlResponse.data.query || !imageUrlResponse.data.query.pages) {
                throw new Error('Unexpected API response');
            }
            const pages = imageUrlResponse.data.query.pages;
            let imageUrl;
            for (const p in pages) {
                if (pages[p].imageinfo) {
                    imageUrl = pages[p].imageinfo[0].url;
                    imageUrl = imageUrl.split('.png')[0] + '.png';
                }
            }

            return {player: player, image: imageUrl};

        }catch(error){
            console.error('Error:', error.message);
        }
    }));
    return playerImages;
}

module.exports = { getPlayerImages }