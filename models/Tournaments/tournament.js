const regions = ['LCK', 'LCS', 'LEC', 'LPL', "MSI", 'PCS', 'VCS', 'CBLOL', 'LLA'];
const tournaments = {
    'LCK': ['LCK/2024 Season/Spring Season', 'LCK/2024 Season/Spring Playoffs', 'LCK/2024 Season/Summer Season'],
    'LCS': ['LCS/2024 Season/Spring Season', 'LCS/2024 Season/Spring Playoffs', 'LCS/2024 Season/Summer Season'],
    'LEC': ['LEC/2024 Season/Spring Season', 'LEC/2024 Season/Spring Playoffs', 'LEC/2024 Season/Winter Season', 'LEC/2024 Season/Winter Playoffs', 'LEC/2024 Season/Summer Season'],
    'LPL': ['LPL/2024 Season/Spring Season', 'LPL/2024 Season/Spring Playoffs', 'LPL/2024 Season/Summer Placements'],
    'PCS': ['PCS/2024 Season/Spring Season', 'PCS/2024 Season/Spring Playoffs', 'PCS/2024 Season/Summer Season'],
    'VCS': ['VCS/2024 Season/Spring Season', 'VCS/2024 Season/Spring Playoffs', 'VCS/2024 Season/Summer Season'],
    'CBLOL': ['CBLOL/2024 Season/Split 1', 'CBLOL/2024 Season/Split 1 Playoffs', 'CBLOL/2024 Season/Split 2'],
    'LLA': ['LLA/2024 Season/Opening Season', 'LLA/2024 Season/Opening Playoffs', 'LLA/2024 Season/Closing Season'],
    'MSI': ['2024 Mid-Season Invitational'],
};

const patches = {
    'MSI': [{ name: '2024 Mid-Season Invitational', patchesPlayed: '14.8' }],
    'LCK': [{ name: 'LCK/2024 Season/Spring Season', patchesPlayed: '14.1-14.5' }, { name: 'LCK/2024 Season/Spring Playoffs', patchesPlayed: '14.6' }, {name: 'LCK/2024 Season/Summer Season', patchesPlayed: '14.4-14.8'}],
    'LCS': [{ name: 'LCS/2024 Season/Spring Season', patchesPlayed: '14.1-14.5' }, { name: 'LCS/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }, { name: 'LCS/2024 Season/Summer Season', patchesPlayed: '14.12-14.14' }],
    'LEC': [{ name: 'LEC/2024 Season/Spring Season', patchesPlayed: '14.5' }, { name: 'LEC/2024 Season/Spring Playoffs', patchesPlayed: '14.6' }, { name: 'LEC/2024 Season/Winter Season', patchesPlayed: '14.1' }, { name: 'LEC/2024 Season/Winter Playoffs', patchesPlayed: '14.2' }, { name: 'LEC/2024 Season/Summer Season', patchesPlayed: '14.11-14.12' }],
    'LPL': [{ name: 'LPL/2024 Season/Spring Season', patchesPlayed: '14.2-14.5' }, { name: 'LPL/2024 Season/Spring Playoffs', patchesPlayed: '14.6' }, { name: 'LPL/2024 Season/Summer Placements', patchesPlayed: '14.10-14.13' }],
    'PCS': [{ name: 'PCS/2024 Season/Spring Season', patchesPlayed: '14.1-14.3' }, { name: 'PCS/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }, { name: 'PCS/2024 Season/Summer Season', patchesPlayed: '14.11-14.13' }],
    'VCS': [{ name: 'VCS/2024 Season/Spring Season', patchesPlayed: '14.1-14.3' }, { name: 'VCS/2024 Season/Spring Playoffs', patchesPlayed: '14.5'}, { name: 'VCS/2024 Season/Summer Season', patchesPlayed: '14.12' }],
    'CBLOL': [{ name: 'CBLOL/2024 Season/Split 1', patchesPlayed: '14.1-14.5' }, { name: 'CBLOL/2024 Season/Split 1 Playoffs', patchesPlayed: '14.5-14.6' }, { name: 'CBLOL/2024 Season/Split 2', patchesPlayed: '14.10-14.13' }],
    'LLA': [{ name: 'LLA/2024 Season/Opening Season', patchesPlayed: '14.1-14.4' }, { name: 'LLA/2024 Season/Opening Playoffs', patchesPlayed: '14.4-14.5' }, { name: 'LLA/2024 Season/Closing Season', patchesPlayed: '14.11-14.13' }],
};

module.exports = { regions, tournaments, patches };

