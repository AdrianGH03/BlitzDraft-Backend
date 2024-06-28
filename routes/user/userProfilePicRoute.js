const express = require('express');
const { updateProfilePic } = require('../../controllers/user/userProfilePictureController');
const authMiddleware = require('../../middleware/authMiddleware');
const rateLimit = require("express-rate-limit");
const serverAccessMW = require('../../middleware/serverAccessMW.js');

const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 
});

router.use(limiter, serverAccessMW);

router.put('/profile-picture-update', authMiddleware, updateProfilePic);

module.exports = router;