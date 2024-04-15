const checkAuthController = require('../../controllers/authentication/isAuthenticatedController');
const serverAccessMW = require('../../middleware/serverAccessMW');
const authMiddleware = require('../../middleware/authMiddleware');
const userController = require('../../controllers/authentication/userController');
const authController = require('../../controllers/authentication/authController');
const express = require('express');

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  //15 minutes
  windowMs: 15 * 60 * 1000,
  max: 200 
});

router.use(limiter, serverAccessMW);
router.get('/check-authentication', checkAuthController.checkAuthentication);
router.get('/user/info', authMiddleware, userController.getUser)
router.post('/logout', authController.logout);


module.exports = router;