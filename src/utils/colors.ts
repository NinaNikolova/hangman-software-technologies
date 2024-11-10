const colors = ["red", "blue", "green", "lilac", "red", "darkblue", "brown", "purple", "indigo"];

export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}