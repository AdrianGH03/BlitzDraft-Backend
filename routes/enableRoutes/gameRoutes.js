const getGameTokenRoute = require('../game/getGameTokenRoute');
const getGameDataRoute = require('../game/getGameDataRoute');
const getGameCompleteRoute = require('../game/setGameCompleteRoute');
const saveGameRoute = require('../game/saveGameRoute');
const getScore = require('../game/calculateScoreRoute');

module.exports = function(app) {
    app.use('/game-token', getGameTokenRoute);
    app.use('/game-data', getGameDataRoute);
    app.use('/game-check', getGameCompleteRoute);
    app.use('/update', saveGameRoute);
    app.use('/game', getScore);
};