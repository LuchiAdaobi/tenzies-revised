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
   {
     bestTime !== null && (
       <div>
         <h3 style={{ color: "darkolivegreen" }} className="best-time-display">
           Best Time: {formatTime(bestTime)}.
         </h3>
         {bestTimeDice && (
           <p>
             Best Time Dice ID: {bestTimeDice.id}, Time Started:{" "}
             {formatTime(bestTimeDice.timeStarted)}, Time Ended:{" "}
             {formatTime(bestTimeDice.timeEnded)}
           </p>
         )}
       </div>
     );
   }

  //  
  function handleBestTime() {
    if (bestTime) {
      setBestTime(null);
      setBestTimeDice(null);
      localStorage.removeItem("bestTime");
    } else {
      let minTimeDiff = Infinity;
      let bestTimeDice = null;
      let endTime = 0;

      const storedBestTime = localStorage.getItem("bestTime");
      if (storedBestTime) {
        setBestTime(parseInt(storedBestTime, 10));
      }

      diceArray.forEach((die) => {
        if (die.timeEnded !== 0 && die.isHeld) {
          let timeDiff = die.timeEnded - die.timeStarted;
          if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            bestTimeDice = die;
            endTime = die.timeEnded; // Store the end time of the winning dice
          }
        }
      });

      setBestTimeDice(bestTimeDice);
      setBestTime(endTime - bestTimeDice.timeStarted); // Calculate the total time difference
    }
  }


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

    // function handleTenzies() {
    //   if (!tenzies) {
    //     setTenzies(true);
    //     getWinTime();
    //   }
    // }

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

  // GAME CODE THAT KINDA WORKS FOR TIMER
  import { useState, useEffect } from "react";

const useGameTimer = (shouldStart, shouldReset) => {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (shouldStart) {
      interval = setInterval(() => {
        setTotalSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    if (shouldReset) {
      setTotalSeconds(0);
    }

    return () => clearInterval(interval);
  }, [shouldStart, shouldReset]);

  return totalSeconds;
};

// export default useGameTimer;

// Another kinda working Timer code
import { useState, useEffect } from "react";

const useGameTimer2 = (isGameStarted, isGameReset, isGameWon) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    let interval;

    const updateTimer = () => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 59) {
          setMinutes((prevMinutes) => prevMinutes + 1);
          return 0;
        } else {
          return prevSeconds + 1;
        }
      });
    };

    if (isGameStarted && !isGameWon) {
      interval = setInterval(updateTimer, 1000);
    }

    if (isGameWon || isGameReset) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isGameStarted, isGameWon, isGameReset]);

  return { seconds, minutes, setSeconds, setMinutes };
};

// export default useGameTimer;
