const tournamentsRoutes = require('../leaguepedia/tournamentsRoute');
const pickAndBansRoutes = require('../leaguepedia/picksandbansRoute');
const teamImagesRoutes = require('../leaguepedia/teamImagesRoute');
const gameStartingRostersRoutes = require('../leaguepedia/gameSRostersRoute');
const allPlayerImages = require('../leaguepedia/playerImagesRoute');
const getStats = require('../leaguepedia/fetchGameStatsRoute')

module.exports = function(app) {
    app.use('/random', tournamentsRoutes);
    app.use('/matches/pickAndBans', pickAndBansRoutes);
    app.use('/teams/images/sprites', teamImagesRoutes);
    app.use('/matches/game', gameStartingRostersRoutes);
    app.use('/players/images', allPlayerImages);
    app.use('/scrape', getStats);
};