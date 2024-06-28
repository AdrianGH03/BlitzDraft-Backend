

const validator = require('validator');


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