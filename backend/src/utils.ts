/**
 * Function generating the random colors for each round.
 * @returns the color array for the round as a number array
 * @param difficulty - the difficulty of the game as a string
 */
export const generateColors = (difficulty: string): number[] => {
  switch (difficulty) {
    case "medium":
      return getColors(6);
    case "hard":
      return getColors(8);
    default:
      return getColors(4);
  }
};
/**
 * Function for generating a random list of numbers for the colors.
 * @returns the number array
 * @param count - the number of colors to generate
 */
const getColors = (count: number): number[] => {
  const differentColors = 4;
  const colors = [];
  for (let index = 0; index < count; index++) {
    colors.push(Math.floor(Math.random() * differentColors));
  }
  return colors;
};

/**
 * Function returning the time for each round in milliseconds.
 * @returns the time for each round in milliseconds
 * @param difficulty - the difficulty of the game as a string
 */
export const getTimeForEachRoundMs = (difficulty: string): number => {
  switch (difficulty) {
    case "hard":
      return 8000;
    case "medium":
      return 8000;
    default:
      return 8000;
  }
};

/**
 * The function calculating the score for a player for a given round. It adds 100 points for each correct color and in addition it adds a bonus for the time it took to guess the colors.
 * @returns the score for a player for a given round
 * @param answers - the answers of the player for a given round
 * @param correctSequence - the correct sequence of colors for the round
 * @param maxTime - the maximum time for the round in milliseconds
 * @param timeUsed - the time used by the player for the round in milliseconds
 */
export const calculateScore = (
  answers: number[],
  correctSequence: number[],
  timeUsed: number,
  maxTime: number
): number => {
  //Calculating score.
  //For each correct color guessed, add 100 to score.
  //Then, add a timeScore by difference between maxTime and timeUsed
  let score: number = 0;
  correctSequence.forEach((color, index) => {
    if (answers.length > index) {
      const maxTimeScore = 100;
      const timeScore = ((maxTime - timeUsed) / maxTime) * maxTimeScore;
      score += color === answers[index] ? 100 + timeScore : 0;
    }
  });
  return Math.round(score);
};
