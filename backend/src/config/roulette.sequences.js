// Sequenze dirette: correlazione forte e immediata
const DIRECT_SEQUENCES = {
  0: [17], 
  32: [16], 
  15: [13],
  19: [13],
  4: [2],
  21: [20, 14],
  2: [4],
  25: [27, 23],
  17: [0],
  34: [26],
  6: [0],
  27: [23, 25],
  13: [15],
  36: [7],
  11: [35],
  30: [],
  8: [],
  23: [25,27],
  10: [12],
  5: [24],
  24: [12,26],
  16: [32],
  33: [31],
  1: [],
  20: [21,14],
  14: [20,21],
  31: [33],
  9: [],
  22: [],
  18: [13],
  29: [],
  7: [36],
  28: [],
  12: [24],
  35: [11],
  3: [19],
  26: [34,24]
};

const SEQUENCES = {
  '0': ['TIER_UP_SEQUENCES', 'ORPHELINS_DOWN_SEQUENCES'],
  '32': ['TIER_UP_SEQUENCES', 'ORPHELINS_DOWN_SEQUENCES', [33]],
  '15': ['TIER_DOWN_SEQUENCES', 'TIER_UP_SEQUENCES'],
  '19': ['TIER_DOWN_SEQUENCES', 'NEAR_33'],
  '4': ['SEQUENCE_2_4'],                           
  '21': ['SEQUENCE_2_4'],                           
  '2': ['SEQUENCE_2_4'],
  //includere il 20 e 14 solo se la seconda dozzina sofferente                        
  '25': ['NEAR_25', 'NEAR_27', 'NEAR_23', [20,14]],
  '17': ['NEAR_5', 'ORPHELINS_DOWN_SEQUENCES', 'NEAR_14'],
  '34': ['NEAR_9', 'ORPHELINS_DOWN_SEQUENCES', [18]],
  '6': ['NEAR_5', 'ORPHELINS_DOWN_SEQUENCES', 'NEAR_9'],
  //includere il 22 e 18 solo se la seconda dozzina sofferente                        
  '27': ['NEAR_25', 'NEAR_27', 'NEAR_23', [22,18]],
  '13': ['TIER_DOWN_SEQUENCES', [1,18]], 
  '36': ['EXTENDED_ZERO_NEIGHBORS', 'TIER_DOWN_SEQUENCES'], 
  '11': ['NEAR_9', 'NEAR_11', [28]],
  '30': ['NEAR_11', 'SEQUENCE_2_4'],
  '8': ['EXTENDED_ZERO_NEIGHBORS'],
  '23': ['NEAR_25', 'NEAR_27', 'NEAR_23'],
  '10': ['TIER_UP_SEQUENCES', 'ORPHELINS_DOWN_SEQUENCES'],
  '5': ['TIER_UP_SEQUENCES', 'ORPHELINS_DOWN_SEQUENCES'],
  '24': ['TIER_UP_SEQUENCES', 'ORPHELINS_DOWN_SEQUENCES'],
  '16': ['TIER_UP_SEQUENCES'],
  '33': ['ORPHELINS_TOP_SEQUENCES'],
  '1': ['NEAR_19', [1]],
  '20': ['NEAR_5','SEQUENCE_2_4'],
  '14': ['TIER_UP_SEQUENCES', 'SEQUENCE_2_4'],
  '31': ['ORPHELINS_TOP_SEQUENCES', [16]],
  '9': ['ORPHELINS_DOWN_SEQUENCES', [9,22,18]],
  '22': ['NEAR_9', 'NEAR_11', 'ORPHELINS_DOWN_SEQUENCES'],
  '18': ['TIER_DOWN_SEQUENCES', [18,33]],
  '29': ['ORPHELINS_DOWN_SEQUENCES'],
  '7': ['TIER_DOWN_SEQUENCES', 'NEAR_11', [22,7,28]],
  '28': ['NEAR_8', [19,28,7]],
  '12': ['TIER_UP_SEQUENCES', [23]],
  '35': ['NEAR_11', [8,9,22]],
  '3': ['NEAR_9', 'NEAR_27', 'NEAR_23'],
  '26': ['TIER_UP_SEQUENCES', 'ORPHELINS_DOWN_SEQUENCES'],
};

const ZONE_ZERO_NUMBERS = [0, 3, 12, 15, 26, 32, 35];

module.exports = {
  DIRECT_SEQUENCES,
  SEQUENCES,
  ZONE_ZERO_NUMBERS
};
