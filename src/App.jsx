import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Die from "./components/Die";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import useGameTimer from "./components/useGameTimer";

function App() {
  const [diceArray, setDiceArray] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [notSameTenzies, setNotSameTenzies] = useState("");
  const [majorityValue, setMajorityValue] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [rollCount, setRollCount] = useState(0);
  const [gameState, setGameState] = useState({
    isGameStarted: false,
    isGameReset: false,
    isGameWon: false,
    winTime: 0,
  });

  const { width, height } = useWindowSize();

  const { minutes, seconds, isGameReset, isGameStarted, isGameWon } =
    useGameTimer(gameState.isGameStarted);

  // Determine when a game starts
  useEffect(() => {
    const anyDiceHeld = diceArray.some((die) => die.isHeld);
    if (!tenzies && anyDiceHeld) {
      isGameStarted(true);
      setGameState((prev) => ({ ...prev, isGameStarted: true }));
    }
  }, [tenzies, diceArray]);



  // Determine majority held dice when {tenzies === true}
  useEffect(() => {
    if (!tenzies) {
      const allHeldDice = diceArray.every((die) => die.isHeld);
      const heldDice = diceArray.filter((die) => die.isHeld);
      const firstValue = heldDice[0]?.value;
      const allSameValue = diceArray.every((die) => die.value === firstValue);
      const sameValueDice = heldDice.filter((die) => die.value === firstValue);
      const allHeldValues = heldDice.map((die) => die.value);

      let majorityValue = null;
      let maxCount = 0;

      const counts = allHeldValues.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        if (acc[value] > maxCount) {
          majorityValue = value;
          maxCount = acc[value];
        }
        return acc;
      }, {});

      setMajorityValue(majorityValue);

      // Set the text for when the dice isn't same

      if (heldDice.length > 1 && sameValueDice.length === allHeldDice.length) {
        setNotSameTenzies("");
      } else if (allHeldDice && !allSameValue) {
        setNotSameTenzies("Please pick same dice");
      } else {
        setNotSameTenzies("");
      }

      // Determine when dice is all held and set tenzies to true
      if (allHeldDice && allSameValue) {
        setTenzies(true);
        isGameWon(true); // Stop the timer when the game is won
      }
    }
  }, [diceArray, tenzies, isGameWon]);




  // Determine when dice is all held and set tenzies to true
  useEffect(() => {
    const allHeld = diceArray.every((die) => die.isHeld);
    const firstValue = diceArray[0].value;
    const allSameValue = diceArray.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [diceArray]);

  // Effect hooks stop



  // Functions

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
      timeStarted: 0,
      timeEnded: 0,
    };
  }

  function handleBestTime() {
    setBestTime((prev) => !prev);
    console.log("hello");
  }

  function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
  }

  function allNewDice() {
    const diceArr = [];
    for (let i = 0; i < 10; i++) {
      diceArr.push(generateNewDie());
    }

    return diceArr;
  }

  function holdDice(id) {
    setDiceArray((prev) =>
      prev.map((die) => {
        if (die.id === id && die.isHeld) {
          return { ...die, isHeld: false, timeEnded: Date.now() };
        } else if (die.id === id && !die.isHeld) {
          return { ...die, isHeld: true, timeEnded: 0 };
        } else {
          return die;
        }
      })
    );
  }

const handleResetGame = () => {
  setDiceArray(allNewDice());
  setTenzies(false);
  setRollCount(0);
  isGameReset(); // Use the resetTimer function directly
  setGameState((prev) => ({
    ...prev,
    isGameWon: false,
    isGameStarted: false,
  }));
};

  function rollDice() {
    if (tenzies) {
      handleResetGame();
    } else {
      setDiceArray((prev) =>
        prev.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRollCount((prev) => {
        return prev + 1;
      });
    }
  }
  // Functions Ends
  

  // Die component
  const diceElements = diceArray.map((die) => {
    return (
      <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
        notSameTenzies={notSameTenzies}
        majorityValue={majorityValue}
        // id={die.id}
      />
    );
  });

  return (
    <main className="main">
      {tenzies && (
        <div>
          <h1
            style={{
              color: "red",
              margin: 0,
              fontSize: "40px",
              marginTop: ".1rem",
            }}
          >
            You Won!
          </h1>
          <Confetti width={width} height={height} />
        </div>
      )}

      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <h3 style={{ color: "red" }}>{notSameTenzies}</h3>
      <div className="btn-container">
        <button className="btn" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
        <button className="btn best-time" onClick={handleBestTime}>
          {bestTime ? "Hide" : ""} Best Time
        </button>
      </div>

      <div className="game-stats">
        <p>Roll Count : {rollCount}</p>
        <p>
          Elapsed time :
          {gameState.isGameWon
            ? formatTime(gameState.winTime)
            : gameState.isGameReset
            ? " 00m 00s"
            : `${minutes < 10 ? "0" + minutes : minutes}m ${
                seconds < 10 ? "0" + seconds : seconds
              }s`}
        </p>
      </div>
      {bestTime && (
        <div className="win-stats" style={{ color: "#19723d" }}>
          <p>All time Best : {formatTime(gameState.winTime)}.</p>
          <p>Rolls : {rollCount}</p>
        </div>
      )}
    </main>
  );
}

export default App;
