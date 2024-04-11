const express = require('express');
const router = express.Router();
const gameDataController = require('../../controllers/game/gameDataController').fetchAllGameData
const serverAccessMW = require('../../middleware/serverAccessMW');
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10
});
router.use(limiter, serverAccessMW);

router.get('/all-game-data', gameDataController);

module.exports = router;