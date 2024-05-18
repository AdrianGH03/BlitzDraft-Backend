const express = require('express');
const router = express.Router();
const gameDataController = require('../../controllers/game/gameDataController')
const serverAccessMW = require('../../middleware/serverAccessMW');
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 20
});
router.use(limiter, serverAccessMW);

router.post('/all-game-data', gameDataController.validateFetchAllGameData, gameDataController.fetchAllGameData);

module.exports = router;