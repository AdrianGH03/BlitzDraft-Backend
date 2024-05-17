const cPicksBans = require('../stats/champPickBanStatsRoute.js');

module.exports = function(app) {
    app.use('/stats', cPicksBans );
};