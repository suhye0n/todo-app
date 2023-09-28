import React, { createContext, useState, useContext, useEffect } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const initialDarkMode = localStorage.getItem('darkMode') === 'true';
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  useEffect(() => {
    if (darkMode) {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        localStorage.setItem('darkMode', 'false');
    }
}, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  return useContext(DarkModeContext);
};
