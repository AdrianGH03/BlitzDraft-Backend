const express = require('express');
const authController = require('../../controllers/authentication/authController');

const passwordResetController = require('../../controllers/authentication/passwordResetController');

const { body } = require('express-validator');
const serverAccessMW = require('../../middleware/serverAccessMW');

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  //1hr
  windowMs: 60 * 60 * 1000, 
  max: 100 
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



router.post('/logout', authController.logout);




module.exports = router;
