const regions = ['LCK', 'LCS', 'LEC', 'LPL', "MSI", 'PCS', 'VCS', 'CBLOL', 'LLA'];
const tournaments = {
    'LCK': ['LCK/2024 Season/Spring Season', 'LCK/2024 Season/Spring Playoffs'],
    'LCS': ['LCS/2024 Season/Spring Season', 'LCS/2024 Season/Spring Playoffs'],
    'LEC': ['LEC/2024 Season/Spring Season', 'LEC/2024 Season/Spring Playoffs', 'LEC/2024 Season/Winter Season', 'LEC/2024 Season/Winter Playoffs'],
    'LPL': ['LPL/2024 Season/Spring Season', 'LPL/2024 Season/Spring Playoffs'],
    'PCS': ['PCS/2024 Season/Spring Season', 'PCS/2024 Season/Spring Playoffs'],
    'VCS': ['VCS/2024 Season/Spring Season', 'VCS/2024 Season/Spring Playoffs'],
    'CBLOL': ['CBLOL/2024 Season/Split 1', 'CBLOL/2024 Season/Split 1 Playoffs'],
    'LLA': ['LLA/2024 Season/Opening Season', 'LLA/2024 Season/Opening Playoffs'],
    'MSI': ['2024 Mid-Season Invitational'],
};

const patches = {
    'MSI': [{ name: '2024 Mid-Season Invitational', patchesPlayed: '14.8' }],
    'LCK': [{ name: 'LCK/2024 Season/Spring Season', patchesPlayed: '14.1-14.5' }, { name: 'LCK/2024 Season/Spring Playoffs', patchesPlayed: '14.6' }],
    'LCS': [{ name: 'LCS/2024 Season/Spring Season', patchesPlayed: '14.1-14.5' }, { name: 'LCS/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }],
    'LEC': [{ name: 'LEC/2024 Season/Spring Season', patchesPlayed: '14.5' }, { name: 'LEC/2024 Season/Spring Playoffs', patchesPlayed: '14.6' }, { name: 'LEC/2024 Season/Winter Season', patchesPlayed: '14.1' }, { name: 'LEC/2024 Season/Winter Playoffs', patchesPlayed: '14.2' }],
    'LPL': [{ name: 'LPL/2024 Season/Spring Season', patchesPlayed: '14.2-14.5' }, { name: 'LPL/2024 Season/Spring Playoffs', patchesPlayed: '14.6' }],
    'PCS': [{ name: 'PCS/2024 Season/Spring Season', patchesPlayed: '14.1-14.3' }, { name: 'PCS/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }],
    'VCS': [{ name: 'VCS/2024 Season/Spring Season', patchesPlayed: '14.1-14.3' }, { name: 'VCS/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }],
    'CBLOL': [{ name: 'CBLOL/2024 Season/Split 1', patchesPlayed: '14.1-14.5' }, { name: 'CBLOL/2024 Season/Split 1 Playoffs', patchesPlayed: '14.5-14.6' }],
    'LLA': [{ name: 'LLA/2024 Season/Opening Season', patchesPlayed: '14.1-14.4' }, { name: 'LLA/2024 Season/Opening Playoffs', patchesPlayed: '14.4-14.5' }],
};

module.exports = { regions, tournaments, patches };

