import './App.css'; // Make sure to import your CSS

const HEAD = <div className="hangman-head" />;
const BODY = <div className="hangman-body" />;
const RIGHT_ARM = <div className="hangman-right-arm" />;
const LEFT_ARM = <div className="hangman-left-arm" />;
const RIGHT_LEG = <div className="hangman-right-leg" />;
const LEFT_LEG = <div className="hangman-left-leg" />;

const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

type HangmanDrawingProps = {
  numberOfGuesses: number;
};

export function HangmanDrawing({ numberOfGuesses }: HangmanDrawingProps) {
  return (
    <div style={{ position: 'relative' }}>
      {BODY_PARTS.slice(0, numberOfGuesses).map((part, index) => (
        <div key={index}>{part}</div>
      ))}
      <div className="hangman-vertical-pole" />
      <div className="hangman-top-pole" />
      <div className="hangman-main-pole" />
      <div className="hangman-base" />
    </div>
  );
}
