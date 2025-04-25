
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ColorTheme = 'default' | 'purple' | 'blue';

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('default');

  useEffect(() => {
    // Check for saved theme preferences
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColorTheme = localStorage.getItem('colorTheme') as ColorTheme;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  useEffect(() => {
    // Update document classes when theme changes
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color theme
    root.classList.remove('purple-theme', 'blue-theme');
    if (colorTheme !== 'default') {
      root.classList.add(`${colorTheme}-theme`);
    }

    // Save preferences
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorTheme', colorTheme);
  }, [theme, colorTheme]);

  const value = {
    theme,
    colorTheme,
    setTheme: (newTheme: Theme) => setTheme(newTheme),
    setColorTheme: (newColorTheme: ColorTheme) => setColorTheme(newColorTheme),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
