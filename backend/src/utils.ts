export const generateColors = (difficulty: string): string[] => {
  switch (difficulty) {
    case "medium":
      return getColors(6);
    case "hard":
      return getColors(8);
    default:
      return getColors(4);
  }
};
const getColors = (count: number) => {
  const possibleColors = ["green", "red", "blue", "yellow"];
  const colors = [];
  for (let index = 0; index < count; index++) {
    colors.push(
      possibleColors[Math.floor(Math.random() * possibleColors.length)]
    );
  }
  return colors;
};

export const getTimeForEachRound = (difficulty: string): number => {
  switch (difficulty) {
    case "hard":
      return 10;
    case "medium":
      return 10;
    default:
      return 10;
  }
};

export const calculateScore = (answers: string[], correctSequence: string[], timeUsed: number, 
                              maxTime: number) => {
  //Calculating score.
  //For each correct color guessed, add 50 to score.
  //Then, multiply score by difference between maxTime and timeUsed multiplied by 10
  let score: number = 0;
  if (answers.length !== correctSequence.length) {
    return -1;
  }
  correctSequence.forEach((color, index) => {
    score += color === answers[index] ? 50 : 0;
  })
  const difficultyMultiplier = 1 / maxTime;
  const scoreScaledWithDifficulty: number = (maxTime - timeUsed) * difficultyMultiplier;
  const scaledScore = scoreScaledWithDifficulty * 10;
  return scaledScore;
}
