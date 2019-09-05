import React, {useState} from "react";


const useVisualMode = initial => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (mode, replace = false) => {
    if (!replace) {
      setHistory([...history, mode]);
      setMode(mode);
    } else {
      setMode(mode);
    }
  };
  
  const back = () => {
    const historyMode = [...history];
    if(historyMode.length > 1){
      historyMode.pop();
      setHistory(historyMode);
      setMode(historyMode[historyMode.length - 1]);   
    }
  }

  return { 
    mode,
    transition,
    back
  };
};

export default useVisualMode;
