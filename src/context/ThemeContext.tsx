import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeName, ThemeConfig } from '../types';
import { defaultThemeConfig } from '../data/defaultData';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  config: ThemeConfig;
  updateThemeConfig: (partial: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('am_theme');
    return (saved as ThemeName) || defaultThemeConfig.currentTheme;
  });

  const [config, setConfig] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('am_theme_config');
    return saved ? JSON.parse(saved) : defaultThemeConfig;
  });

  useEffect(() => {
    localStorage.setItem('am_theme', theme);
    const root = document.documentElement;

    root.classList.remove('theme-cyber-dark', 'theme-blue', 'theme-green', 'theme-light');
    root.classList.add(`theme-${theme}`);

    // Update CSS variables
    if (theme === 'cyber-dark') {
      root.style.setProperty('--cyber-primary', '#00f2fe');
      root.style.setProperty('--cyber-secondary', '#10b981');
      root.style.setProperty('--cyber-accent', '#3b82f6');
      root.style.setProperty('--cyber-bg', '#060913');
      root.style.setProperty('--cyber-card', 'rgba(10, 18, 36, 0.7)');
      root.style.setProperty('--cyber-card-border', 'rgba(0, 242, 254, 0.18)');
      root.style.setProperty('--cyber-text', '#f8fafc');
    } else if (theme === 'blue') {
      root.style.setProperty('--cyber-primary', '#38bdf8');
      root.style.setProperty('--cyber-secondary', '#6366f1');
      root.style.setProperty('--cyber-accent', '#0284c7');
      root.style.setProperty('--cyber-bg', '#030e22');
      root.style.setProperty('--cyber-card', 'rgba(8, 24, 52, 0.75)');
      root.style.setProperty('--cyber-card-border', 'rgba(56, 189, 248, 0.22)');
      root.style.setProperty('--cyber-text', '#f0f9ff');
    } else if (theme === 'green') {
      root.style.setProperty('--cyber-primary', '#10b981');
      root.style.setProperty('--cyber-secondary', '#059669');
      root.style.setProperty('--cyber-accent', '#14b8a6');
      root.style.setProperty('--cyber-bg', '#04140c');
      root.style.setProperty('--cyber-card', 'rgba(6, 32, 20, 0.75)');
      root.style.setProperty('--cyber-card-border', 'rgba(16, 185, 129, 0.25)');
      root.style.setProperty('--cyber-text', '#ecfdf5');
    } else if (theme === 'light') {
      root.style.setProperty('--cyber-primary', '#0284c7');
      root.style.setProperty('--cyber-secondary', '#059669');
      root.style.setProperty('--cyber-accent', '#6366f1');
      root.style.setProperty('--cyber-bg', '#f4f6fa');
      root.style.setProperty('--cyber-card', 'rgba(255, 255, 255, 0.88)');
      root.style.setProperty('--cyber-card-border', 'rgba(2, 132, 199, 0.2)');
      root.style.setProperty('--cyber-text', '#0f172a');
    }
  }, [theme, config]);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    setConfig((prev) => ({ ...prev, currentTheme: t }));
  };

  const updateThemeConfig = (partial: Partial<ThemeConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem('am_theme_config', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config, updateThemeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
