const express = require('express');
const getTeamImages = require('../../controllers/leaguepedia/teamImagesController.js').getTeamImages;
const router = express.Router();
const allTournaments = require('../../models/Tournaments/tournament.js').tournaments;
const serverAccessMW = require('../../middleware/serverAccessMW.js');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 
});

router.use(limiter, serverAccessMW);

function getTournament(req, res){

    const tournament = decodeURIComponent(req.params.tournament);
    if (!tournament || !Object.values(allTournaments).some(tournamentsArray => tournamentsArray.includes(tournament))) {
        throw new Error('Invalid tournament');
    }

    const teams = req.query.teams ? req.query.teams.split(',') : []; 
    

    getTeamImages(tournament, teams)
    .then(data => {
        console.log('data:', data);
        res.send(data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred');
    });
}

router.get('/:tournament', getTournament);

module.exports = router;