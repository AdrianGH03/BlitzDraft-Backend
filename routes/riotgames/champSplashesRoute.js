const express = require('express');
const getChampSplashes = require('../../controllers/riotgames/champSplashesController.js').getChampSplashes;
const router = express.Router();
const querystring = require('querystring');
const serverAccessMW = require('../../middleware/serverAccessMW.js');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter, serverAccessMW);

function champSplashes(req, res){
    const picksAndBans = decodeURIComponent(req.params.tournament);
    if(!picksAndBans){
        res.status(400).send('Bad request');
    }

    // Parse the picksAndBans string back into an object
    const champsObject = querystring.parse(picksAndBans);

    getChampSplashes(champsObject)

    .then(data => {
        console.log('data:', data);
        res.send(data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred');
    });
}

router.get('/:tournament', champSplashes); // Changed getTournament to champSplashes


module.exports = router;