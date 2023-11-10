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

export default useGameTimer;
