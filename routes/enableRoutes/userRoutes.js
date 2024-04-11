const updateUserPFP = require('../user/userProfilePicRoute');

module.exports = function(app) {
    app.use('/user',  updateUserPFP);
};