const colors = ["red", "blue", "green", "#ff6600", "lilac", "red", "darkblue", "brown", "purple", "indigo", "pink"];

export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}