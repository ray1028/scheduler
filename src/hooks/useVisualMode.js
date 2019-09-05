import React, { useState } from "react";

const useVisualMode = initial => {
  const [oldMode, setMode] = useState(initial);
  const [oldHistory, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    if (!replace) {
      console.log(newMode);
      const newHistory = [...oldHistory, newMode];
      setHistory(newHistory);
      setMode(newMode);
    } else {
      setMode(prev => (newMode));
      console.log(newMode);
    }

  };

  const back = () => {
    const historyMode = [...oldHistory];
    if (historyMode.length > 1) {
      historyMode.pop();
      setHistory(historyMode);
      setMode(historyMode[historyMode.length - 1]);
    }
  };

  return {
    mode: oldMode,
    transition,
    back
  };
};

export default useVisualMode;



