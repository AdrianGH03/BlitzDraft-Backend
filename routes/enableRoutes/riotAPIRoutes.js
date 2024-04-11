const getChampSplashes = require('../riotgames/champSplashesRoute')
const profilePicsRouter = require('../riotgames/profilePicsRoute')
const allChampSpritesRouter = require('../riotgames/allChampSpritesRoute')


module.exports = function(app) {
    app.use('/champions/splashes', getChampSplashes);
    app.use('/public', profilePicsRouter);
    app.use('/champion', allChampSpritesRouter);
};