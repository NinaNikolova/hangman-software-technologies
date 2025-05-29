import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import { getRandomImage } from "./utils/images";
import { getRandomColor } from "./utils/colors";

import st from "./wordList4.json";

import dm from "./wordList6.json";

type WordList = Record<string, string>;

function App() {
  const [selectedTopic, setSelectedTopic] = useState("dm");
  const [wordList, setWordList] = useState<WordList>(dm);
  const [wordToGuess, setWordToGuess] = useState("");
  const [wordToShow, setWordToShow] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [bgWordColor, setBgWordColor] = useState(getRandomColor());
  const [backgroundImage, setBackgroundImage] = useState(getRandomImage());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const getWord = useCallback(() => {
    const entries = Object.entries(wordList);
    const randomIndex = Math.floor(Math.random() * entries.length);
    const [key, value] = entries[randomIndex];
    setWordToShow(value);
    return key;
  }, [wordList]);

  const resetGame = useCallback(() => {
    const newWord = getWord();
    setWordToGuess(newWord);
    setBgWordColor(getRandomColor());
    setBackgroundImage(getRandomImage());
    setGuessedLetters([]);
  }, [getWord]);

  const handleTopicChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const topic = event.target.value;
    setSelectedTopic(topic);

    switch (topic) {
      case "dm":
        setWordList(dm);
        break;
        case "st":
          setWordList(st);
          break;
      default:
        setWordList(dm);
    }

    resetGame();
  }, [resetGame]);

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));
  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;
      setGuessedLetters(currentLetters => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  useEffect(() => {
    resetGame();
  }, [wordList, resetGame]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key.match(/^[a-z]$/)) {
        addGuessedLetter(key);
      } else if (key === "Enter") {
        resetGame();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [addGuessedLetter, resetGame]);

  useEffect(() => {
    if (isWinner || isLoser) {
      setTimeout(resetGame, 2000);
    }
  }, [isWinner, isLoser, resetGame]);

  return (
    <div
      className="container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <select id="topicSelect" value={selectedTopic} onChange={handleTopicChange}>
      <option value="dm">DM</option>
        <option value="st">ST</option>

      </select>

      <div
        style={{
          fontSize: "2rem",
          marginTop: "10px",
          position: "fixed",
          top: "10px",
          right: "10px",
        }}
      >
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
          activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
