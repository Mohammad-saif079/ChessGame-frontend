import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {

const [remotemove, setremotemove] = useState(null)  


  const value = {
    remotemove,
    setremotemove
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// custom hook
export const useGame = () => useContext(GameContext);