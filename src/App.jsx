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
  const [bestTime, setBestTime] = useState();

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

  // ... (previous code remains the same)

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

  // ... (previous code remains the same)
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
    };
  }
  function handleBestTime() {
     if (bestTime) {
       setBestTime("");
     } else {
       setBestTime(Date.now());
     }
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
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
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
    }
  }

  return (
    <main className="main">
      {tenzies && (
        <div>
          <h1 style={{ color: "red", margin: 0, fontSize: "45px" }}>
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
          {bestTime ? 'Hide' : 'Show'} Best Time
        </button>
      </div>
      {bestTime && <h3 style={{color : 'green'}}>Best Time: {bestTime}</h3>}
    </main>
  );
}

export default App;
