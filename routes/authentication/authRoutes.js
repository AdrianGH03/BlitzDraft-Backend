const express = require('express');
const authController = require('../../controllers/authentication/authController');
const authMiddleware = require('../../middleware/authMiddleware');
const userController = require('../../controllers/authentication/userController');
const passwordResetController = require('../../controllers/authentication/passwordResetController');
const checkAuthController = require('../../controllers/authentication/isAuthenticatedController');
const { body } = require('express-validator');
const serverAccessMW = require('../../middleware/serverAccessMW');

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter, serverAccessMW);

router.post('/signup', 
  [
    body('username').trim().isLength({ min: 1 }).escape(),
    body('password').trim().isLength({ min: 1 }).escape(),
  ],
  authController.signup
);

router.post('/login', 
  [
    body('username').trim().isLength({ min: 1 }).escape(),
    body('password').trim().isLength({ min: 1 }).escape(),
  ],
  authController.login
);

router.get('/user/info', authMiddleware, userController.getUser)

router.post('/logout', authController.logout);
router.get('/check-authentication', checkAuthController.checkAuthentication);



module.exports = router;
