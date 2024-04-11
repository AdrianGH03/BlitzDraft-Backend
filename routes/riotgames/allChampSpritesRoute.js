const express = require('express');
const getAllChampSprites = require('../../controllers/riotgames/getAllChampionNames.js').getAllChampSprites;
const router = express.Router();

const serverAccessMW = require('../../middleware/serverAccessMW.js');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter, serverAccessMW);

//send response in json format
function champSprites(req, res){
    getAllChampSprites()
    .then(data => {
        res.send(data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred');
    }
    );
}

router.get('/all-champ-sprites', champSprites);

module.exports = router;