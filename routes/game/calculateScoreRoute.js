const getScore = require('../../controllers/game/gameCalculateScore.js').gameCalculateScore;
const serverAccessMW = require('../../middleware/serverAccessMW');
const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 100 requests per windowMs
});
router.use(serverAccessMW, limiter);



router.post('/calculate-score', getScore);

module.exports = router;