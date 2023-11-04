import { useState } from "react";
import Die from "./components/Die";

function App() {
  const [diceArray, setDiceArray] = useState(allNewDice());

  const diceElements = diceArray.map((die) => {
    return <Die key={die} value={die} />;
  });

  function allNewDice() {
    const diceArr = [];
    for (let i = 0; i < 10; i++) {
      diceArr.push(Math.ceil(Math.random() * 6));
    }

    return diceArr;
  }

  return (
    <main className="main">
      <div className="dice-container">
        {/* <Die value={value} /> */}
        {diceElements}
      </div>
    </main>
  );
}

export default App;
