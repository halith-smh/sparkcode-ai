import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appProperties, setAppProperties] = useState({});
  const [userPrompt, setUserPrompt] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  return (
    <AppContext.Provider value={{ appProperties, setAppProperties, userPrompt, setUserPrompt, apiMessage, setApiMessage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
