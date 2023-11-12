import useLocalStorage from "@/lib/hooks/use-localstorage";
import { createContext, useContext } from "react";

type Theme = {
  primary: string;
  secondary: string;
};

export type ThemeContextType = {
  theme: Theme;
  changeTheme: () => void;
  themeKey: keyof typeof themes;
};

export const themes = {
  king: {
    primary: "bg-teal-600",
    secondary: "bg-teal-100",
  },
  queen: {
    primary: "bg-pink-600",
    secondary: "bg-pink-100",
  },
  warrior: {
    primary: "bg-blue-600",
    secondary: "bg-blue-100",
  },
  lagos: {
    primary: "bg-green-600",
    secondary: "bg-teal-100",
  },
  oslo: {
    primary: "bg-gray-500",
    secondary: "bg-gray-100",
  },
};

const DEFAULT_THEME_KEY = "king";

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export const ThemeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [themeKey, setThemeKey] = useLocalStorage<keyof typeof themes>(
    "theme",
    DEFAULT_THEME_KEY
  );

  const changeTheme = () => {
    const keys = Object.keys(themes);
    const nextIndex = keys.findIndex((key) => key === themeKey) + 1;
    const nextKey = keys[nextIndex] || keys[0];
    setThemeKey(nextKey as keyof typeof themes);
  };

  return (
    <ThemeContext.Provider
      value={{ themeKey, theme: themes[themeKey], changeTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
