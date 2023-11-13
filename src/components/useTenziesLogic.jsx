import { useEffect } from "react";

const useTenziesLogic = (
  diceArray,
  tenzies,
  isGameWon,
  setNotSameTenzies,
  setMajorityValue,
  handleGameWon
) => {
  // Determine majority held dice when {tenzies === true}
  useEffect(() => {
    if (!tenzies) {
      const heldDice = diceArray.filter((die) => die.isHeld);
      const allHeldDiceValues = heldDice.map((die) => die.value);

      let majorityValue = null;
      let maxCount = 0;

      const counts = allHeldDiceValues.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        if (acc[value] > maxCount) {
          majorityValue = value;
          maxCount = acc[value];
        }
        return acc;
      }, {});

      setMajorityValue(majorityValue);

      // Set the text for when the dice aren't the same
      const allHeldDice = diceArray.every((die) => die.isHeld);
      const firstValueHeldDice = heldDice[0]?.value;
      const allSameValue = diceArray.every(
        (die) => die.value === firstValueHeldDice
      );

      if (allSameValue && allHeldDice) {
        setNotSameTenzies("");
      } else if (allHeldDice && !allSameValue) {
        setNotSameTenzies("Roll again...");
      } else {
        setNotSameTenzies("");
      }
    }
  }, [
    diceArray,
    tenzies,
    isGameWon,
    setNotSameTenzies,
    setMajorityValue,
    handleGameWon,
  ]);
};

export default useTenziesLogic;
