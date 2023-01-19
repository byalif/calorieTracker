import React, { useState } from "react";

export const AppContext = React.createContext();
const url = "http://localhost:5000/todos";

export const AppProvider = ({ children }) => {
  const [iD, setiD] = useState("");

  return (
    <AppContext.Provider
      value={{
        iD,
        setiD,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
