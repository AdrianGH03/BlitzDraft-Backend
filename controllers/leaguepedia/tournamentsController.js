const regions = require('../../models/Tournaments/tournament.js').regions;
const tournaments = require('../../models/Tournaments/tournament.js').tournaments;

function getRandomTournament(req, res) {
  // Get a random region.
  const randomRegion = regions[Math.floor(Math.random() * regions.length)];

  // Get a random tournament from the random region.
  const randomTournament = tournaments[randomRegion][Math.floor(Math.random() * tournaments[randomRegion].length)];

  // Send the random region and tournament as the response.
  res.json({ region: randomRegion, tournament: randomTournament });
}

module.exports = { getRandomTournament };