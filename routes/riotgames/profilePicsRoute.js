const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require("express-rate-limit");
const serverAccessMW = require('../../middleware/serverAccessMW.js');

const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300 
});

router.use(limiter, serverAccessMW);

function getProfilePics(req, res){
    const directoryPath = path.join(__dirname, '../../public/profile-pictures');
    
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
        res.status(500).send(err);
        return;
        }
        res.send(files);
    });
} 

router.get('/profile-pictures', getProfilePics);

module.exports = router;