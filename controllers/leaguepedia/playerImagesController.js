const leaguepediaClient = require('../../clients/leaguepediaClient');
const sanitize = require('sanitize-filename');

// Helper function to add delay between requests (rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getPlayerImages(allPlayers){
    allPlayers = allPlayers.split(',').map(player => sanitize(player));
    const playerImages = [];

    // Process players sequentially with delays to respect rate limit (60 req/min = 1 req/sec)
    for (const player of allPlayers) {
        try {
            const response = await leaguepediaClient.get({
                action: 'cargoquery',
                format: 'json',
                tables: 'PlayerImages=P',
                fields: 'P.FileName, P.Link',
                where: `P.Link='${player}'`,
            });
            
            if (!response || !response.cargoquery) {
                console.error('Unexpected API response for player:', player);
                playerImages.push({player: player, image: null});
                await delay(1100); // 1.1 second delay between requests
                continue;
            }

            const imagesByYear = {};
            for(let index in response.cargoquery){
                const fileName = response.cargoquery[index].title.FileName;
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

            await delay(1100); // Delay before second request

            const imageUrlResponse = await leaguepediaClient.get({
                action: 'query',
                format: 'json',
                prop: 'imageinfo',
                iiprop: 'url',
                titles: 'File:' + latestYearImages
            });

            if (!imageUrlResponse || !imageUrlResponse.query || !imageUrlResponse.query.pages) {
                console.error('Unexpected API response for image URL:', player);
                playerImages.push({player: player, image: null});
                await delay(1100);
                continue;
            }

            const pages = imageUrlResponse.query.pages;
            let imageUrl;
            for (const p in pages) {
                if (pages[p].imageinfo) {
                    imageUrl = pages[p].imageinfo[0].url;
                    imageUrl = imageUrl.split('.png')[0] + '.png';
                }
            }

            playerImages.push({player: player, image: imageUrl});
            await delay(1100); // Delay after completing player

        } catch(error){
            console.error('Error fetching player image for', player, ':', error.message);
            
            playerImages.push({player: player, image: null});
            
        }
    }

    return playerImages;
}

module.exports = { getPlayerImages }