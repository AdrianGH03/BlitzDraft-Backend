const express = require('express');
const { body } = require('express-validator');
const serverAccessMW = require('../../middleware/serverAccessMW');
const passwordResetController = require('../../controllers/authentication/passwordResetController');


const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, //1hr
    max: 15
});

router.use(limiter, serverAccessMW);

router.post('/request-password-reset', 
  [
    body('email').trim().isEmail().escape(),
  ],
  passwordResetController.requestPasswordReset
);

router.post('/reset-password', 
  [
    body('token').trim().isLength({ min: 1 }).escape(),
    body('newPassword').trim().isLength({ min: 1 }).escape(),
  ],
  passwordResetController.resetPassword
);



module.exports = router;