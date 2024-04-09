let gamePointsConfig = {
  guesstry: 1,
  guesswin: 10,
};

const updatePointsForTry = (newValue) => {
  gamePointsConfig.guesstry = newValue;
};

const updatePointsForWin = (newValue) => {
  gamePointsConfig.guesswin = newValue;
};

const getConfig = () => gamePointsConfig;

export { updatePointsForTry, updatePointsForWin, getConfig };