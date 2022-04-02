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
