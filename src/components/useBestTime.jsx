import { useState} from "react";

const useBestTime = () => {
  const [bestTime, setBestTime] = useState(
    // Provide a default value (0) if there is no value in local storage
    parseInt(localStorage.getItem("bestTime")) || 0
  );
  const [bestRollCount, setBestRollCount] = useState(
    parseInt(localStorage.getItem("bestRollCount")) || 0
  );

  const updateBestTime = (newWinTime, newRollCount) => {
    // If the newWinTime is less than the current bestTime or bestTime is 0,
    // update the bestTime and bestRollCount
    if (newWinTime < bestTime || bestTime === 0) {
      setBestTime(newWinTime);
      setBestRollCount(newRollCount);
      localStorage.setItem("bestTime", newWinTime);
      localStorage.setItem("bestRollCount", newRollCount);
    }
  };

  return {
    bestTime,
    bestRollCount,
    updateBestTime,
  };
};

export default useBestTime;
