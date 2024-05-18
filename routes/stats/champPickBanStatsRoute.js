const express = require('express');
const { getChampPickBans } = require('../../controllers/statsleaguepedia/getTournamentPicksAndBansController');
const rateLimit = require("express-rate-limit");
const serverAccessMW = require('../../middleware/serverAccessMW.js');

const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 35
});

router.use(limiter, serverAccessMW);

router.post('/cpicksbans', getChampPickBans);

module.exports = router;