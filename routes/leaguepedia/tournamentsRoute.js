const express = require('express');
const getRandomTournament = require('../../controllers/leaguepedia/tournamentsController.js').getRandomTournament;
const serverAccessMW = require('../../middleware/serverAccessMW.js');
const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 
});

router.use(limiter, serverAccessMW);



router.get('/tournament', (req, res, next) => {
    getRandomTournament(req, res, next);
});

module.exports = router;