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
const getColors = (count: number): number[] => {
  const differentColors = 4;
  const colors = [];
  for (let index = 0; index < count; index++) {
    colors.push(Math.floor(Math.random() * differentColors));
  }
  return colors;
};

export const getTimeForEachRoundMs = (difficulty: string): number => {
  switch (difficulty) {
    case "hard":
      return 20000;
    case "medium":
      return 20000;
    default:
      return 20000;
  }
};

export const calculateScore = (
  answers: number[],
  correctSequence: number[],
  timeUsed: number,
  maxTime: number
): number => {
  //Calculating score.
  //For each correct color guessed, add 50 to score.
  //Then, multiply score by difference between maxTime and timeUsed multiplied by 10
  let score: number = 0;
  console.log(answers);
  console.log(correctSequence);
  if (answers.length !== correctSequence.length) {
    return -1;
  }
  correctSequence.forEach((color, index) => {
    score += color === answers[index] ? 50 : 0;
  });
  const difficultyMultiplier = 1 / maxTime;
  const scoreScaledWithDifficulty: number =
    (maxTime - timeUsed) * difficultyMultiplier;
  const scaledScore = scoreScaledWithDifficulty * 100;
  return scaledScore;
};
