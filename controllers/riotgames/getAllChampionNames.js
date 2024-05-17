const axios = require('axios');
const champsRoleModel = require('../../models/Game/champRolesModel.js');

async function getAllChampSprites(){
    try {
        const patchResponse = await axios.get('https://ddragon.leagueoflegends.com/realms/na.json');
        const patch = patchResponse.data.v;
        const championsResponse = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`);
        const champions = championsResponse.data.data;
        let champSprites = {};
        for (let champ in champions) {
            champSprites[champ] = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${champions[champ].id}.png`;
        }

        let newChampModel = {};
        for (let role in champsRoleModel) {
            newChampModel[role] = {};
            for (let champ of champsRoleModel[role]) {
                if (champSprites[champ]) {
                    newChampModel[role][champ] = champSprites[champ];
                }
            }
            
        }
       
        return newChampModel;
        
    } catch (error) {
        console.error(`Failed to get patch version: ${error}`);
    }
}

module.exports = { getAllChampSprites };