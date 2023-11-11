import { useEffect } from "react";


const useTenziesLogic = (
    diceArray,
    tenzies,
    isGameWon,
    setTenzies,
    setNotSameTenzies,
    setMajorityValue,
    handleGameWon
    ) => {
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

      // Set the text for when the dice aren't the same

      if (heldDice.length > 1 && sameValueDice.length === allHeldDice.length) {
        setNotSameTenzies("");
      } else if (allHeldDice && !allSameValue) {
        setNotSameTenzies("Roll again...");
      } else {
        setNotSameTenzies("");
      }

      // Determine when dice are all held and set tenzies to true
      if (allHeldDice && allSameValue) {
        setTenzies(true);
        isGameWon(true); // Stop the timer when the game is won
        handleGameWon(); // Call handleGameWon when the game is won
      }
    }
  }, [
    diceArray,
    tenzies,
    isGameWon,
    setTenzies,
    setNotSameTenzies,
    setMajorityValue,
    handleGameWon,
  ]);
};

export default useTenziesLogic;
