
const getScrapeStats = require('./webScrapeStatsController').getScrapeStats;
const Stats = require('../../models/Game/StatsModel');

async function updateStats() {
  const stats = await getScrapeStats();
  await Stats.deleteMany({});
  await Stats.create({ data: stats });
  
}

async function getStats(req, res) {
  const stats = await Stats.findOne();
  res.json(stats);
}

module.exports = { updateStats, getStats };