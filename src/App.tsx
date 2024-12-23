import { useCallback, useEffect, useState } from "react";
import './App.css';
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import { getRandomImage } from "./utils/images";
import { getRandomColor } from "./utils/colors";
import umlWords from "./wordList1.json";
import softwareTechWords from "./wordList2.json";
type WordList = Record<string, string>;
let bgWord = '';
let randomIndex = 1;
let wordList: WordList = umlWords;


function App() {
  const [selectedTopic, setSelectedTopic] = useState("uml");
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [wordToShow, setWordToShow] = useState(bgWord);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [bgWordColor, setBgWordColor] = useState(getRandomColor());
  const [backgroundImage, setBackgroundImage] = useState(getRandomImage());
  const [level, setLevel] = useState(1);

  function getWord() {
    const entries = Object.entries(wordList); // Use wordList based on the selected topic
    randomIndex = Math.floor(Math.random() * entries.length);
    const [key, value] = entries[randomIndex];
    bgWord = value;
    return key;
  }
  const handleTopicChange = (event: any) => {
    setSelectedTopic(event.target.value);
    switch (event.target.value) {
      case "uml":
        wordList = umlWords;
        break;
      case "softwareTech":
        wordList = softwareTechWords;
        break;
      default:
        wordList = umlWords;
    }
    resetGame(); // Start with a new word when topic changes
  };
  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every(letter => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;
      setGuessedLetters(currentLetters => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [addGuessedLetter]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "Enter") return;
      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord()); // Reset to a new word
    };
    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  useEffect(() => {
    if (isWinner) {
      setTimeout(resetGame, 2000);
    } else if (isLoser) {
      setTimeout(resetGame, 2000);
    }
  }, [isWinner, isLoser]);

  const resetGame = () => {
    const newWord = getWord();
    setWordToGuess(newWord);
    setWordToShow(bgWord);
    setBgWordColor(getRandomColor());
    setBackgroundImage(getRandomImage());
    setGuessedLetters([]);
  };

  return (
    <div
      className="container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Dropdown to select topic */}
      <select id="topicSelect" value={selectedTopic} onChange={handleTopicChange}>
        <option value="uml">UML</option>
        <option value="softwareTech">Software Technologies</option>
      </select>
      {/* Display Emoji for Winner or Loser */}
      <div style={{
        fontSize: "2rem",
        marginTop: "10px",
        position: "fixed",
        top: "10px",
        right: "10px",
      }}>
        {isWinner && "👍"} {isLoser && "👎"}
      </div>
      <div style={{ color: bgWordColor, fontSize: "1.4rem" }}>
        {wordToShow}
      </div>

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />

      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />

      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
