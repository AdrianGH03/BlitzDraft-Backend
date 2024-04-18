const express = require('express');
const router = express.Router();
const getStatsFunction = require('../../controllers/leaguepedia/StatsController').getStats;
const rateLimit = require("express-rate-limit");
const serverAccessMw = require('../../middleware/serverAccessMW');

const limiter = rateLimit({
    //10 mins
    windowMs: 10 * 60 * 1000,
    max: 100 
});

router.use(serverAccessMw, limiter);

router.get('/pbstats', getStatsFunction);

module.exports = router;