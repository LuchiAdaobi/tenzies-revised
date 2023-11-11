// for (let i = 0; i < 10; i++) {
//   diceElements.push(<Die key={i} value={value} />);
// }

function allNewDice() {
  // const diceArr = Array.from(
  //   { length: 10 },
  //   () => Math.floor(Math.random() * 6) + 1
  // );
  const diceArr = [];
  for (let i = 0; i < 10; i++) {
    diceArr.push(Math.ceil(Math.random() * 6));
  }

  return diceArr;
}

//

// APP.JS
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Die from "./components/Die";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

function App() {
  const [diceArray, setDiceArray] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [notSameTenzies, setNotSameTenzies] = useState("");
  const [majorityValue, setMajorityValue] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  // const [bestTimeDice, setBestTimeDice] = useState(null);
  const [rollCount, setRollCount] = useState(0);
  const [winTime, setWinTime] = useState();

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!tenzies) {
      const allHeldDice = diceArray.every((die) => die.isHeld);
      const allHeld = diceArray.filter((die) => die.isHeld);
      const firstValue = allHeld[0]?.value;
      const allSameValue = diceArray.every((die) => die.value === firstValue);
      const sameValueDice = allHeld.filter((die) => die.value === firstValue);

      if (allHeld.length > 1 && sameValueDice.length === allHeld.length) {
        setNotSameTenzies("");
      } else if (allHeldDice && !allSameValue) {
        setNotSameTenzies(
          "All your values are not the same. Please choose the same values"
        );
      } else {
        setNotSameTenzies("");
      }
    }
  }, [tenzies, diceArray]);

  useEffect(() => {
    if (!tenzies) {
      const heldDice = diceArray.filter((die) => die.isHeld);
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
    }
  }, [diceArray, tenzies]);

  useEffect(() => {
    const allHeld = diceArray.every((die) => die.isHeld);
    const firstValue = diceArray[0].value;
    const allSameValue = diceArray.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [diceArray]);

  useEffect(() => {
    if (tenzies) {
      getWinTime(diceArray);
    }
  }, [tenzies, diceArray]);

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
    console.log("hello");
  }

  function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
  }

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

  function rollDice() {
    // setDiceArray(allNewDice());
    if (tenzies) {
      setDiceArray(allNewDice());
      setTenzies(false);
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

  function getWinTime(diceArray) {
    if (tenzies) {
      const firstStrokeTime = diceArray.find(
        (die) => die.timeEnded !== 0
      )?.timeEnded;
      if (firstStrokeTime !== undefined) {
        const currentTime = Date.now();
        const timeDifference = currentTime - firstStrokeTime;
        const formattedTime = formatTime(timeDifference);
        setWinTime(formattedTime);
      }
    }
  }

  return (
    <main className="main">
      {tenzies && (
        <div>
          <h1
            style={{
              color: "red",
              margin: 0,
              fontSize: "40px",
              marginTop: "1rem",
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
        <p>Win Time : {winTime}</p>
      </div>
    </main>
  );
}

export default App;

// game timer that works too
import { useState, useEffect } from "react";

const useGameTimer1 = (isGameStarted, isGameReset, isGameWon) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isGameStarted && !isGameWon) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => prevMinutes + 1);
            return 0;
          } else {
            return prevSeconds + 1;
          }
        });
      }, 10000);
    }

    if (isGameReset && !isGameWon) {
      setSeconds(0);
      setMinutes(0);
    }

    return () => clearInterval(interval);
  }, [isGameStarted, isGameWon, isGameReset]);

  return { seconds, minutes, setSeconds, setMinutes };
};

// export default useGameTimer;

// WORKING BUT SKIPPING IN 2s

import { useState, useEffect } from "react";

const useGameTimer = (isGameStarted, isGameReset, isGameWon) => {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isGameStarted && !isGameWon) {
      interval = setInterval(() => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
      }, 1000);
    }

    if (isGameReset && isGameWon) {
      setTotalSeconds(0);
    }

    return () => clearInterval(interval);
  }, [isGameStarted, isGameWon, isGameReset]);

  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return { seconds, minutes, setTotalSeconds };
};

// export default useGameTimer;

// APP WITH TIMER THAT SKIPS IN 2s
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
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameReset, setIsGameReset] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [winTime, setWinTime] = useState(0);

  // const { seconds, minutes, setSeconds, setMinutes } = useGameTimer(
  //   isGameStarted,
  //   isGameReset,
  //   isGameWon
  // );

  const { width, height } = useWindowSize();
  const { seconds, minutes, setTotalSeconds } = useGameTimer(
    isGameStarted,
    isGameReset,
    isGameWon
  );

  useEffect(() => {
    if (tenzies) {
      setIsGameWon(true);
      const firstStrokeTime = diceArray.find(
        (die) => die.timeEnded !== 0
      )?.timeEnded;
      if (firstStrokeTime !== undefined) {
        const currentTime = Date.now();
        const timeDifference = currentTime - firstStrokeTime;
        setWinTime(timeDifference);
      }
    }
  }, [tenzies, diceArray]);

  useEffect(() => {
    const anyDiceHeld = diceArray.some((die) => die.isHeld);
    if (!tenzies && anyDiceHeld) {
      setIsGameStarted(true);
    }
  }, [tenzies, diceArray]);

  useEffect(() => {
    if (tenzies) {
      setIsGameStarted(false);
      setIsGameReset(true);
      setIsGameWon(true);
    }
  }, [tenzies]);

  useEffect(() => {
    let interval;

    if (isGameStarted && !isGameWon) {
      interval = setInterval(() => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
      }, 1000);
    }

    if (isGameWon) {
      clearInterval(interval);
    }

    if (isGameReset && !isGameWon) {
      setTotalSeconds(0);
    }

    return () => clearInterval(interval);
  }, [isGameStarted, isGameWon, isGameReset, setTotalSeconds]);

  // useEffect(() => {
  //   let interval;

  //   if (isGameStarted && !isGameWon) {
  //     interval = setInterval(() => {
  //       setSeconds((prevSeconds) => {
  //         if (prevSeconds === 59) {
  //           setMinutes((prevMinutes) => prevMinutes + 1);
  //           return 0;
  //         } else {
  //           return prevSeconds + 1;
  //         }
  //       });
  //     }, 1000);
  //   }

  //   if (isGameWon) {
  //     clearInterval(interval);
  //   }

  //   if (isGameReset && isGameWon) {
  //     setSeconds(0);
  //     setMinutes(0);
  //   }

  //   return () => clearInterval(interval);
  // }, [isGameStarted, isGameWon, isGameReset, setSeconds, setMinutes]);

  useEffect(() => {
    if (!tenzies) {
      const allHeldDice = diceArray.every((die) => die.isHeld);
      const allHeld = diceArray.filter((die) => die.isHeld);
      const firstValue = allHeld[0]?.value;
      const allSameValue = diceArray.every((die) => die.value === firstValue);
      const sameValueDice = allHeld.filter((die) => die.value === firstValue);

      if (allHeld.length > 1 && sameValueDice.length === allHeld.length) {
        setNotSameTenzies("");
      } else if (allHeldDice && !allSameValue) {
        setNotSameTenzies("Please pick same dice");
      } else {
        setNotSameTenzies("");
      }
    }
  }, [tenzies, diceArray]);

  useEffect(() => {
    if (!tenzies) {
      const heldDice = diceArray.filter((die) => die.isHeld);
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
    }
  }, [diceArray, tenzies]);

  useEffect(() => {
    const allHeld = diceArray.every((die) => die.isHeld);
    const firstValue = diceArray[0].value;
    const allSameValue = diceArray.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [diceArray]);

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
    setIsGameWon(false);
    setIsGameStarted(false);
    setIsGameReset(true);

    setWinTime(0);
    // setDisplayTime(0);
    setIsGameReset(false);
    setTotalSeconds(0);
    // setMinutes(0);
    // setSeconds(0);
  };

  function rollDice() {
    if (tenzies) {
      setDiceArray(allNewDice());
      setTenzies(false);
      setRollCount(0);
      setIsGameWon(false);
      setIsGameStarted(false);
      setIsGameReset(true);
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

  return (
    <main className="main">
      {tenzies && (
        <div>
          <h1
            style={{
              color: "red",
              margin: 0,
              fontSize: "40px",
              marginTop: "1rem",
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
          {" "}
          Elapsed time:
          {isGameWon
            ? formatTime(winTime)
            : isGameReset
            ? "00m 00s"
            : `${minutes < 10 ? "0" + minutes : minutes}m ${
                seconds < 10 ? "0" + seconds : seconds
              }s`}
        </p>
      </div>
      {bestTime && (
        <div className="win-stats" style={{ color: "#19723d" }}>
          <p>All time Best : {formatTime(winTime)}.</p>
          <p>Rolls : {rollCount}</p>
        </div>
      )}
    </main>
  );
}

// export default App;


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
        handleGameWon(); // Call handleGameWon when the game is won
      }
    }
  }, [diceArray, tenzies, isGameWon]);

// Pseudocode for storing best time in LS and then displaying it on click along with the rol count for the highest figure

// Create LS for winTime
// Get first winTime and store it to LS
// Create LS for corresponding roll count of that first win
// Get that roll count and store it to LS
// write a function that runs everytime a game is won ie finished

// The function gets the winTime already saved in LS and compare with present winTime
// if present time is shorter than saved winTime, then the new winTime replaces the one in LS and then we get the accompanying rollCount of the win time and replaces it with the one in LS
//  else the old winTime and roll count remains
// when the Best time win button is clicked, I want to then display the current best time and its corresponding roll count

// I'd like to write it all in a different custom hook if possible or as much of it as possible
