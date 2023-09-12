import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

// Create Context object
export const NavigationContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const NavigationProvider = ({ children }) => {
  const [navigationHistory, setNavigationHistory] = useState([]);
  const { asPath } = useRouter();

  useEffect(() => {
    // Check if the user navigated back
    if (
      navigationHistory.length > 1 &&
      asPath === navigationHistory[navigationHistory.length - 2]
    ) {
      // The user navigated back. Remove the last path from the history.
      setNavigationHistory((prevHistory) =>
        prevHistory.slice(0, prevHistory.length - 1)
      );
    } else {
      // The user navigated forward. Add the path to the history.
      setNavigationHistory((prevHistory) => [...prevHistory, asPath]);
    }
  }, [asPath]);

  const previousPage =
    navigationHistory.length > 1
      ? navigationHistory[navigationHistory.length - 2]
      : null;

  return (
    <NavigationContext.Provider value={{ previousPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

// custom hook for easy access to the context
export const useNavigationContext = () => {
  return useContext(NavigationContext);
};
