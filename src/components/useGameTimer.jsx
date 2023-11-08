import { useState, useEffect } from "react";

const useGameTimer = (isGameStarted, isGameReset, isGameWon) => {
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
      }, 1000);
    }

    if (isGameReset && !isGameWon) {
      setSeconds(0);
      setMinutes(0);
    }

    return () => clearInterval(interval);
  }, [isGameStarted, isGameWon, isGameReset]);

  return { seconds, minutes, setSeconds, setMinutes };
};

export default useGameTimer;
