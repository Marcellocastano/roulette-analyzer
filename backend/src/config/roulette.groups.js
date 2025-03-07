// Gruppi di numeri frequentemente associati
const NUMBER_GROUPS = {
  ZERO_NEIGHBORS: [0,3,12,15,26,32,35],
  EXTENDED_ZERO_NEIGHBORS: [4,19,28,7],
  TIER_UP_SEQUENCES: [10,5,24,16],
  TIER_DOWN_SEQUENCES: [13,27,36],
  ORPHELINS_DOWN_SEQUENCES: [17,34,6],
  ORPHELINS_TOP_SEQUENCES: [9,31,14,20,1,33],
  SEQUENCE_2_4: [2,4,21,20,14,31],
  NEAR_27: [27,13,6],
  NEAR_25: [25,2,17],
  NEAR_23: [23,8,10],
  NEAR_11: [11,36,30],
  NEAR_9: [9,31,22],
  NEAR_19: [19,2,21,4],
  NEAR_8: [8,30,23],
};

// Funzione helper per unire più gruppi di numeri
const combineGroups = (...groups) => {
  return [...new Set(groups.flat())];
};

// Funzione helper per espandere i gruppi nelle sequenze
const expandGroups = (sequence) => {
  if (Array.isArray(sequence)) {
    return combineGroups(...sequence.map(group => 
      Array.isArray(group) ? group : NUMBER_GROUPS[group] || [group]
    ));
  }
  return NUMBER_GROUPS[sequence] || [sequence];
};

module.exports = {
  NUMBER_GROUPS,
  combineGroups,
  expandGroups
};
