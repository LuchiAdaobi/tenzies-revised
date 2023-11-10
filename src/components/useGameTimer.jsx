import { useState, useEffect, useRef } from "react";

const useGameTimer = (initiallyRunning = false) => {
  const [running, setRunning] = useState(initiallyRunning);
  const [time, setTime] = useState(0);
  const interval = useRef();

  useEffect(() => {
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  const resetTimer = () => {
    clearInterval(interval.current);
    setTime(0);
    setRunning(false);
  };

  useEffect(() => {
    if (running) {
      const handleTick = () => {
        setTime((prevTime) => prevTime + 1);
      };
      interval.current = setInterval(handleTick, 1000);
    }

    // Clear the interval when the component unmounts or when the running status changes
    return () => {
      clearInterval(interval.current);
    };
  }, [running]);

  return {
    minutes: Math.floor(time / 60),
    seconds: time % 60,
    isGameReset: resetTimer,
    isGameStarted: () => setRunning(true),
    isGameWon: () => setRunning(false),
  };
};

export default useGameTimer;
