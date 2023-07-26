export const sentimentScoreToText = (
  score: number | null
): [string, string] => {
  if (score === null) return ["N/A", "Gray"];
  if (score <= -75) return ["Extremely Negative", "DarkRed"];
  if (score <= -50) return ["Very Negative", "Red"];
  if (score <= -25) return ["Negative", "IndianRed"];
  if (score < -5) return ["Slightly Negative", "Salmon"];
  if (score <= 5) return ["Neutral", "Gray"];
  if (score < 25) return ["Slightly Positive", "LightGreen"];
  if (score < 50) return ["Positive", "LimeGreen"];
  if (score < 75) return ["Very Positive", "Green"];
  return ["Extremely Positive", "DarkGreen"];
};
