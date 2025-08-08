"use client"
import { useState, useEffect, createContext, useContext } from 'react'

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const storedTheme = localStorage.getItem("marinasuite-theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      setTheme("system")
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    let effectiveTheme = theme;
    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    root.classList.add(effectiveTheme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem("marinasuite-theme", theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
