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

