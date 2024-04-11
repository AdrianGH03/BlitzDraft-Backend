//frontend choose image, store it in state
// create function to send image to backend, use token to authenticate but first check if a user is logged in. parameters should be image, 
const crypto = require('crypto');
const User = require('../../models/MongoDB/User');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');

exports.updateProfilePic = async (req, res) => {
    const { image } = req.body;

    if(!image){
        return res.status(400).send({ error: 'Missing Image' });
    }

    const sanitizedImage = validator.escape(image);

    try {
        const user = req.user;
        user.profileImage = sanitizedImage;
        
        await user.save();

        res.send({ message: 'Profile picture updated' });
    } catch (error) {
        return res.status(500).send({ error: 'Server error.' });
    }
}