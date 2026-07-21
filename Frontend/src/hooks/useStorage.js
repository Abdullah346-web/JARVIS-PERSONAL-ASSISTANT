import React, { useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      console.error(`Error reading localStorage key "${key}"`);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = React.useState(getStoredValue);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}"`, error);
    }
  };

  return [storedValue, setValue];
};

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return [theme, setTheme];
};
