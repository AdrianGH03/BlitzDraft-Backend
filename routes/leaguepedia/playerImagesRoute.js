const express = require('express');
const getPlayerImages = require('../../controllers/leaguepedia/playerImagesController.js').getPlayerImages;
const serverAccessMW = require('../../middleware/serverAccessMW.js');
const router = express.Router(); 
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 
});

router.use(limiter, serverAccessMW);

function getAllPlayerImages(req, res){
    const allPlayers = decodeURIComponent(req.params.allPlayers);

    getPlayerImages(allPlayers)
    .then(data => {
        res.send(data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Failed to get player images');
    });
}

router.get('/:allPlayers', getAllPlayerImages);

module.exports = router;