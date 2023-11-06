import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Die from "./components/Die";
import Confetti from "react-confetti";

function App() {
  const [diceArray, setDiceArray] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [notTenzies, setNotTenzies] = useState("");

  useEffect(() => {
    if (!tenzies) {
      const allHeld = diceArray.every((die) => die.isHeld);
      const firstValue = diceArray[0].value;
      const allSameValue = diceArray.every((die) => die.value === firstValue);

      if (allHeld && !allSameValue) {
        setNotTenzies(
          "All your values are not the same. Please choose the same values"
        );
      } else {
        setNotTenzies("");
      }
    }
  }, [tenzies, diceArray]);

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

  const diceElements = diceArray.map((die) => {
    return (
      <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
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
          <Confetti />
        </div>
      )}

      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <h3 style={{color : 'red'}}>{notTenzies}</h3>
      <button className="btn" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
