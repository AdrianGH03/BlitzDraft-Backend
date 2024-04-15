const express = require('express');
const passwordResetController = require('../../controllers/authentication/passwordResetController');
const authController = require('../../controllers/authentication/authController');
const { body } = require('express-validator');
const serverAccessMW = require('../../middleware/serverAccessMW');

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  //5hr
  windowMs: 5 * 60 * 60 * 1000, 
  max: 10
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






module.exports = router;
