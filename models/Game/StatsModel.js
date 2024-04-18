const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({}, { strict: false, collection: 'stats' });
const Stats = mongoose.model('Stats', StatsSchema);

module.exports = Stats;