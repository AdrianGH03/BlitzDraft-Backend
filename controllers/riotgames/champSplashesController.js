const axios = require('axios');

async function getChampSplashes(picksAndBans){
    if (typeof picksAndBans !== 'object') {
        throw new Error('Invalid input: picksAndBans must be an object');
    }

    let picks = {};
    let bans = {};

    for (let key in picksAndBans) {
        if (key.includes('Pick')) {
            picks[key] = picksAndBans[key];
        } else if (key.includes('Ban')) {
            bans[key] = picksAndBans[key];
        }
    }

    let patch;
    try {
        const patchResponse = await axios.get('https://ddragon.leagueoflegends.com/realms/na.json');
        patch = patchResponse.data.v;
    } catch (error) {
        console.error(`Failed to get patch version: ${error}`);
    }

    let pickSplashes;
    let banSplashes;
    let pickSplashesMobile;
    try {
        pickSplashes = await getChampSplashCentered(picks);
        banSplashes = await getChampSplashSquare(patch, bans);
        pickSplashesMobile = await getChampSplashSquareDesktop(patch, picks);
    } catch (error) {
        console.error(`Failed to get champion splashes: ${error}`);
    }

    return {
        picks: pickSplashes,
        bans: banSplashes,
        picksMobile: pickSplashesMobile
    };
}

const specialCasesPicks = {
    "RenataGlasc": "Renata",
    "Wukong": "MonkeyKing",
    "KaiSa": "Kaisa",
    "KhaZix": "Khazix",
    "LeBlanc": "Leblanc",
    "BelVeth": "Belveth",
    "RekSai": "RekSai",
    "VelKoz": "Velkoz",
    "JarVanIV": "JarvanIV",
    "Fiddlesticks": "FiddleSticks",
    
};

const specialCasesBans = {
    "RenataGlasc": "Renata",
    "Wukong": "MonkeyKing",
    "KaiSa": "Kaisa",
    "KhaZix": "Khazix",
    "LeBlanc": "Leblanc",
    "BelVeth": "Belveth",
    "RekSai": "RekSai",
    "VelKoz": "Velkoz",
    "JarVanIV": "JarvanIV",
    "Fiddlesticks": "Fiddlesticks",
};

async function getChampSplashCentered(picks){
    let pickSplashes = {};
    for (let pick in picks) {
        let cleanPick = picks[pick].replace(/[^a-zA-Z0-9]/g, ''); 
        cleanPick = specialCasesPicks[cleanPick] || cleanPick;
        if (cleanPick == picks[pick]) {
            cleanPick = cleanPick.charAt(0).toUpperCase() + cleanPick.slice(1).toLowerCase();
        }
        pickSplashes[pick] = `https://ddragon.leagueoflegends.com/cdn/img/champion/centered/${cleanPick}_0.jpg`;
    }
    return pickSplashes;
}

async function getChampSplashSquareDesktop(patch, picks){
    let pickSplashesMobile = {};
    for (let pick in picks) {
        let cleanPick = picks[pick].replace(/[^a-zA-Z0-9]/g, ''); 
        cleanPick = specialCasesPicks[cleanPick] || cleanPick;
        if (cleanPick == picks[pick]) {
            cleanPick = cleanPick.charAt(0).toUpperCase() + cleanPick.slice(1).toLowerCase();
        }
        pickSplashesMobile[pick] = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${cleanPick}.png`;
    }
    return pickSplashesMobile;
}

async function getChampSplashSquare(patch, bans){
    let banSplashes = {};
    for (let ban in bans) {
        let cleanBan = bans[ban].replace(/[^a-zA-Z0-9]/g, ''); 
        cleanBan = specialCasesBans[cleanBan] || cleanBan;
        if (cleanBan == bans[ban]) {
            cleanBan = cleanBan.charAt(0).toUpperCase() + cleanBan.slice(1).toLowerCase();
        }
        banSplashes[ban] = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${cleanBan}.png`;
    }
    return banSplashes;
}

module.exports = {
    getChampSplashes
}