const regions = require('../../models/Tournaments/tournament.js').regions;
const tournaments = require('../../models/Tournaments/tournament.js').tournaments;

function getRandomTournament(req, res) {

  const randomRegion = regions[Math.floor(Math.random() * regions.length)];


  const randomTournament = tournaments[randomRegion][Math.floor(Math.random() * tournaments[randomRegion].length)];


  res.json({ region: randomRegion, tournament: randomTournament });
}

module.exports = { getRandomTournament };