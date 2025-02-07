// Disposizione dei numeri sulla ruota della roulette europea
const ROULETTE_WHEEL = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

// Mappa per ottenere rapidamente l'indice di un numero sulla ruota
const NUMBER_TO_INDEX = ROULETTE_WHEEL.reduce((map, num, index) => {
  map[num] = index;
  return map;
}, {});

module.exports = {
  ROULETTE_WHEEL,
  NUMBER_TO_INDEX
};
