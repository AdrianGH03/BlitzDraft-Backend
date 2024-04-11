const express = require('express');
const gameStartingRosters = require('../../controllers/leaguepedia/gameSRostersController.js').gameStartingRosters;
const serverAccessMW = require('../../middleware/serverAccessMW.js');


const router = express.Router(); 
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 
});

router.use(limiter, serverAccessMW);

function getStartingRoster(req, res){
    const gameId = decodeURIComponent(req.params.gameId);
    if (!/^[a-zA-Z0-9\s/]+_\w+\s+\d+_\d+_\d+$/.test(gameId)) {
        throw new Error('Invalid gameId');
    }

    gameStartingRosters(gameId)
    .then(data => {
        console.log('data:', data);
        res.send(data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred');
    });
}

router.get('/:gameId', getStartingRoster);

module.exports = router;