var medpoints = 10
var ezpoints = 10
var hardpoints = 10

var order = [
  "Team1Ban1",
  "Team2Ban1",
  "Team1Ban2",
  "Team2Ban2",
  "Team1Ban3",
  "Team2Ban3",
  "Team1Pick1",
  "Team2Pick1",
  "Team2Pick2",
  "Team1Pick2",
  "Team1Pick3",
  "Team2Pick3",
  "Team2Ban4",
  "Team1Ban4",
  "Team2Ban5",
  "Team1Ban5",
  "Team2Pick4",
  "Team1Pick4",
  "Team2Pick5",
  "Team1Pick5",
]

const difficultySettings = {
    easy: {
      total: 50,
      pointsPer: ezpoints,
      pickBanCards: 15,
      order: order,
      cardsRevealed: [
        "Team1Ban1",
        "Team2Ban1",
        "Team1Ban2",
        "Team2Ban2",
        "Team1Ban3",
        "Team2Ban3",
        "Team1Pick1",
        "Team2Pick1",
        "Team2Pick2",
        "Team1Pick2",
        "Team1Pick3",
        "Team2Pick3",
        "Team2Ban4",
        "Team1Ban4",
        "Team2Ban5",
      ]
    },
    medium: {
      total: 100,
      pointsPer: medpoints,
      pickBanCards: 10,
      order: order,
      cardsRevealed: [
        "Team1Ban1",
        "Team2Ban1",
        "Team1Ban2",
        "Team2Ban2",
        "Team1Ban3",
        "Team2Ban3",
        "Team1Pick1",
        "Team2Pick1",
        "Team2Pick2",
        "Team1Pick2",
      ]
    },
    hard: {
      total: 150,
      pointsPer: hardpoints,
      pickBanCards: 5,
      order: order,
      cardsRevealed: [
        "Team1Ban1",
        "Team2Ban1",
        "Team1Ban2",
        "Team2Ban2",
        "Team1Ban3",
      ]
    }
};

module.exports = { difficultySettings };