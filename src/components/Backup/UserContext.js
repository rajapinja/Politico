// UserContext.js
import React, { createContext, useState, useContext } from 'react';

// User Context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);


// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, setIsDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
