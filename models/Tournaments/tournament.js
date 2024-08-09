const regions = ['LCK', 'LCS', 'LEC', 'LPL', "MSI", 'PCS', 'VCS', 'CBLOL', 'LLA'];
const tournaments = {
    'LCK': ['LCK/2024 Season/Spring Season', 'LCK/2024 Season/Spring Playoffs', 'LCK/2024 Season/Summer Season'],
    'LCS': ['LCS/2024 Season/Spring Season', 'LCS/2024 Season/Spring Playoffs', 'LCS/2024 Season/Summer Season'],
    'LEC': ['LEC/2024 Season/Spring Season', 'LEC/2024 Season/Spring Playoffs', 'LEC/2024 Season/Winter Season', 'LEC/2024 Season/Winter Playoffs', 'LEC/2024 Season/Summer Season', 'LEC/2024 Season/Summer Playoffs'],
    'LPL': ['LPL/2024 Season/Spring Season', 'LPL/2024 Season/Spring Playoffs', 'LPL/2024 Season/Summer Placements', 'LPL/2024 Season/Summer Season', 'LPL/2024 Season/Summer Playoffs'],
    'PCS': ['PCS/2024 Season/Spring Season', 'PCS/2024 Season/Spring Playoffs', 'PCS/2024 Season/Summer Season', 'PCS/2024 Season/Summer Playoffs'],
    'VCS': ['VCS/2024 Season/Spring Season', 'VCS/2024 Season/Spring Playoffs', 'VCS/2024 Season/Summer Season'],
    'CBLOL': ['CBLOL/2024 Season/Split 1', 'CBLOL/2024 Season/Split 1 Playoffs', 'CBLOL/2024 Season/Split 2', 'CBLOL/2024 Season/Split 2 Playoffs'],
    'LLA': ['LLA/2024 Season/Opening Season', 'LLA/2024 Season/Opening Playoffs', 'LLA/2024 Season/Closing Season', 'LLA/2024 Season/Closing Playoffs'], 
    'MSI': ['2024 Mid-Season Invitational'],
    "PCL": ['PCL/2024 Season/Spring Season', 'PCL/2024 Season/Spring Playoffs', 'PCL/2024 Season/Summer Season', 'PCL/2024 Season/Summer Playoffs'],
    "LJL": ['LJL/2024 Season/Spring Season', 'LJL/2024 Season/Spring Playoffs', 'LJL/2024 Season/Summer Season', 'LJL/2024 Season/Summer Playoffs'],
    "NACL": ['North American Challengers League/2024 Season/Spring Promotion', 'North American Challengers League/2024 Season/Spring Season', 'North American Challengers League/2024 Season/Spring Playoffs', 'North American Challengers League/2024 Season/Summer Promotion', 'North American Challengers League/2024 Season/Summer Season'],
    "LVPSL": ['LVP SuperLiga/2024 Season/Spring Season', 'LVP SuperLiga/2024 Season/Spring Playoffs', 'LVP SuperLiga/2024 Season/Summer Season', 'LVP SuperLiga/2024 Season/Summer Playoffs'],
    "LFL": ['LFL/2024 Season/Spring Season', 'LFL/2024 Season/Spring Playoffs', 'LFL/2024 Season/Summer Season', 'LFL/2024 Season/Summer Playoffs'],
    "EMEAM": ['EMEA Masters/2024 Season/Spring Play-In', 'EMEA Masters/2024 Season/Spring Main Event', 'EMEA Masters/2024 Season/Summer LCQ', 'EMEA Masters/2024 Season/Summer Main Event'],
    "LCO": ['LCO/2024 Season/Split 1', 'LCO/2024 Season/Split 1 Playoffs', 'LCO/2024 Season/Split 2', 'LCO/2024 Season/Split 2 Playoffs'],
    "LCKCL": ['LCK CL/2024 Season/Spring Season', 'LCK CL/2024 Season/Spring Playoffs', 'LCK CL/2024 Season/Summer Season'],
};

const patches = {
    'MSI': [{ name: '2024 Mid-Season Invitational', patchesPlayed: '14.8' }],
    'LCK': [{ name: 'LCK/2024 Season/Spring Season', patchesPlayed: '14.1-14.5' }, { name: 'LCK/2024 Season/Spring Playoffs', patchesPlayed: '14.6' }, {name: 'LCK/2024 Season/Summer Season', patchesPlayed: '14.11-14.14'}],
    'LCS': [{ name: 'LCS/2024 Season/Spring Season', patchesPlayed: '14.1-14.5' }, { name: 'LCS/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }, { name: 'LCS/2024 Season/Summer Season', patchesPlayed: '14.12-14.15' }],
    'LEC': [{ name: 'LEC/2024 Season/Spring Season', patchesPlayed: '14.5' }, { name: 'LEC/2024 Season/Spring Playoffs', patchesPlayed: '14.6' }, { name: 'LEC/2024 Season/Winter Season', patchesPlayed: '14.1' }, { name: 'LEC/2024 Season/Winter Playoffs', patchesPlayed: '14.2' }, { name: 'LEC/2024 Season/Summer Season', patchesPlayed: '14.11-14.12' }, { name: 'LEC/2024 Season/Summer Playoffs', patchesPlayed: '14.13' }],
    'LPL': [{ name: 'LPL/2024 Season/Spring Season', patchesPlayed: '14.2-14.5' }, { name: 'LPL/2024 Season/Spring Playoffs', patchesPlayed: '14.6' }, { name: 'LPL/2024 Season/Summer Placements', patchesPlayed: '14.10-14.13' }, { name: 'LPL/2024 Season/Summer Season', patchesPlayed: '14.13-14.14' }, { name: 'LPL/2024 Season/Summer Playoffs', patchesPlayed: '14.14-14.15' }],
    'PCS': [{ name: 'PCS/2024 Season/Spring Season', patchesPlayed: '14.1-14.3' }, { name: 'PCS/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }, { name: 'PCS/2024 Season/Summer Season', patchesPlayed: '14.11-14.13' }, { name: 'PCS/2024 Season/Summer Playoffs', patchesPlayed: '14.15' }],
    'VCS': [{ name: 'VCS/2024 Season/Spring Season', patchesPlayed: '14.1-14.3' }, { name: 'VCS/2024 Season/Spring Playoffs', patchesPlayed: '14.5'}, { name: 'VCS/2024 Season/Summer Season', patchesPlayed: '14.12-14.14' }],
    'CBLOL': [{ name: 'CBLOL/2024 Season/Split 1', patchesPlayed: '14.1-14.5' }, { name: 'CBLOL/2024 Season/Split 1 Playoffs', patchesPlayed: '14.5-14.6' }, { name: 'CBLOL/2024 Season/Split 2', patchesPlayed: '14.10-14.14'}, { name: 'CBLOL/2024 Season/Split 2 Playoffs', patchesPlayed: '14.15-14.16' }],
    'LLA': [{ name: 'LLA/2024 Season/Opening Season', patchesPlayed: '14.1-14.4' }, { name: 'LLA/2024 Season/Opening Playoffs', patchesPlayed: '14.4-14.5' }, { name: 'LLA/2024 Season/Closing Season', patchesPlayed: '14.11-14.14' }, { name: 'LLA/2024 Season/Closing Playoffs', patchesPlayed: '14.14-14.15' }],
    'PCL': [{ name: 'PCL/2024 Season/Spring Season', patchesPlayed: '14.1-14.5' }, { name: 'PCL/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }, { name: 'PCL/2024 Season/Summer Season', patchesPlayed: '14.10-14.13' }, { name: 'PCL/2024 Season/Summer Playoffs', patchesPlayed: '14.14' }],
    'LJL': [{ name: 'LJL/2024 Season/Spring Season', patchesPlayed: '14.1b-14.2' }, { name: 'LJL/2024 Season/Spring Playoffs', patchesPlayed: '14.3' }, { name: 'LJL/2024 Season/Summer Season', patchesPlayed: '14.11-14.13' }, { name: 'LJL/2024 Season/Summer Playoffs', patchesPlayed: '14.13' }],
    'NACL': [{ name: 'North American Challengers League/2024 Season/Spring Promotion', patchesPlayed: '13.16' }, { name: 'North American Challengers League/2024 Season/Spring Season', patchesPlayed: '14.1-14.5' }, { name: 'North American Challengers League/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }, { name: 'North American Challengers League/2024 Season/Summer Promotion', patchesPlayed: '14.6' }, { name: 'North American Challengers League/2024 Season/Summer Season', patchesPlayed: '14.12-14.15' }],
    'LVPSL': [{ name: 'LVP SuperLiga/2024 Season/Spring Season', patchesPlayed: '14.1-b-14.4' }, { name: 'LVP SuperLiga/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }, { name: 'LVP SuperLiga/2024 Season/Summer Season', patchesPlayed: '14.9-14.13' }, { name: 'LVP SuperLiga/2024 Season/Summer Playoffs', patchesPlayed: '14.13' }],
    'LFL': [{ name: 'LFL/2024 Season/Spring Season', patchesPlayed: '14.1b-14.4' }, { name: 'LFL/2024 Season/Spring Playoffs', patchesPlayed: '14.5' }, { name: 'LFL/2024 Season/Summer Season', patchesPlayed: '14.9-14.13' }, { name: 'LFL/2024 Season/Summer Playoffs', patchesPlayed: '14.13' }],
    'EMEAM': [{ name: 'EMEA Masters/2024 Season/Spring Play-In', patchesPlayed: '14.7' }, { name: 'EMEA Masters/2024 Season/Spring Main Event', patchesPlayed: '14.7' }, { name: 'EMEA Masters/2024 Season/Summer LCQ', patchesPlayed: '14.13' }, { name: 'EMEA Masters/2024 Season/Summer Main Event', patchesPlayed: '14.15' }],
    'LCO': [{ name: 'LCO/2024 Season/Split 1', patchesPlayed: '14.1-14.3' }, { name: 'LCO/2024 Season/Split 1 Playoffs', patchesPlayed: '14.3' }, { name: 'LCO/2024 Season/Split 2', patchesPlayed: '14.10-14.13' }, { name: 'LCO/2024 Season/Split 2 Playoffs', patchesPlayed: '14.13' }],
    'LCKCL': [{ name: 'LCK CL/2024 Season/Spring Season', patchesPlayed: '14.1b-14.5' }, { name: 'LCK CL/2024 Season/Spring Playoffs', patchesPlayed: '14.5-14.6' }, { name: 'LCK CL/2024 Season/Summer Season', patchesPlayed: '14.11-14.15' }],
};

module.exports = { regions, tournaments, patches };

