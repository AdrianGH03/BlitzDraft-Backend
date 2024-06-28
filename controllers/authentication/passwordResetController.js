const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../../models/MongoDB/User');
require('dotenv').config();
const validator = require('validator');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const transporter = createTransporter();


function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });
}


function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]{8,20}$/;
  return passwordRegex.test(password);
}


async function findUser(email, username) {
  return await User.findOne({ email, username });
}


async function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


exports.requestPasswordReset = async (req, res) => {
  try {
    const { email, username } = req.body;
    if(!email || !username) {
      return res.status(400).send({ error: 'Missing Email or Username' });
    }
    const sanitizedEmail = validator.escape(email);
    const sanitizedUsername = validator.escape(username);
    const user = await findUser(sanitizedEmail, sanitizedUsername);

    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).send({ error: 'Invalid email.' });
    } else if(sanitizedUsername.length < 1) {
      return res.status(400).send({ error: 'Invalid username.' });
    } else if (!user) {
      return res.status(400).send({ error: 'User with this email and username does not exist.' });
    }

    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1800000; // 30 minutes
    await user.save();

    const mailOptions = {
      from: {
        name: 'BlitzDraft Password Reset',
        address: process.env.EMAIL_USERNAME,
      },
      to: sanitizedEmail,
      subject: 'BlitzDraft Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your BlitzDraft account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${process.env.RESET_LINK}/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    try {
      await sendMail(mailOptions);
      res.send({ message: 'An email has been sent to ' + sanitizedEmail + ' with further instructions.' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: 'Failed to send email.' + err });
    }
  } catch (error) {
    console.error(error); 
    res.status(500).send({ error: 'An error occurred.' });
  }
};


exports.resetPassword = async (req, res) => {
  var { token } = req.body;
  var { newPassword } = req.body;
  var { confirmPassword } = req.body;

  token = validator.escape(token);

  if (!token) {
    return res.status(400).send({ error: 'No token provided.' });
  }

  const user = await User.findOne({ resetPasswordToken: token });

  if (!user) {
    return res.status(400).send({ error: 'Invalid token.' });
  }

  if (Date.now() > user.resetPasswordExpires) {
    return res.status(400).send({ error: 'Token has expired.' });
  }

  newPassword = validator.escape(newPassword);
  if (!validatePassword(newPassword) && !validatePassword(confirmPassword)) {
    return res.status(400).send({ error: 'Password must be between 8 and 20 characters, contain at least one uppercase letter, one number, and one special character.' });
  } else if (newPassword == user.password) {
    return res.status(400).send({ error: 'New password must be different from the old password.' });
  } else if (newPassword !== confirmPassword) {
    return res.status(400).send({ error: 'Passwords do not match.' });
  }

  bcrypt.hash(newPassword, saltRounds, async (err, hashedPassword) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to hash password.' });
    }
  
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  
    res.send({ message: 'Password has been reset.' });
  });
};