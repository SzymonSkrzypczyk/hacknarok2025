import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

type ThemeName =
    | "alfheim"
    | "asgard"
    | "jotunheim"
    | "vanaheim"
    | "midgard"
    | "svaralfheim"
    | "niflheim"
    | "helheim"
    | "muspelheim";

export const themes: {
    name: ThemeName;
    label: string;
    color: string;
    runeSymbol: string;
}[] = [
    { name: "alfheim", label: "Alfheim", color: "#4338CA", runeSymbol: "ᛊ" }, // Ansuz - A
    { name: "asgard", label: "Asgard", color: "#F5F5F5", runeSymbol: "ᚷ" }, // Ansuz+Naudiz
    { name: "jotunheim", label: "Jotunheim", color: "#A16207", runeSymbol: "ᛇ" }, // Jera
    { name: "vanaheim", label: "Vanaheim", color: "#7E22CE", runeSymbol: "ᛟ" }, // Wunjo
    { name: "midgard", label: "Midgard", color: "#727272", runeSymbol: "ᚥ" }, // Mannaz
    { name: "svaralfheim", label: "Svaralfheim", color: "#1D4ED8", runeSymbol: "ᛞ" }, // Sowilo
    { name: "niflheim", label: "Niflheim", color: "#047857", runeSymbol: "ᚾ" }, // Naudiz
    { name: "helheim", label: "Helheim", color: "#0E7490", runeSymbol: "ᚺ" }, // Hagalaz
    { name: "muspelheim", label: "Muspelheim", color: "#B91C1C", runeSymbol: "ᚷ" }, // Gebo
];

const STORAGE_KEY = "theme-preference";
const THEME_ATTRIBUTE = "data-theme";

type ThemeContextType = {
    theme: ThemeName | undefined; // Undefined until mounted
    setTheme: (theme: ThemeName) => void;
    themes: typeof themes;
    currentTheme: { name: ThemeName; label: string; color: string; runeSymbol: string };
    resolvedTheme: ThemeName | undefined; // Added to match next-themes API
    forcedTheme: ThemeName | null; // For pages with forced themes
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: ThemeName;
    storageKey?: string;
    forcedTheme?: ThemeName | null;
    attribute?: string;
    disableTransitionOnChange?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = "midgard",
    storageKey = STORAGE_KEY,
    forcedTheme = null,
    attribute = THEME_ATTRIBUTE,
    disableTransitionOnChange = false,
}) => {
    const [theme, setThemeState] = useState<ThemeName | undefined>(undefined);
    const [resolvedTheme, setResolvedTheme] = useState<ThemeName | undefined>(undefined);
    const [mounted, setMounted] = useState(false);

    // Get the current theme object based on theme name or resolved theme
    const currentTheme =
        themes.find((t) => {
            if (forcedTheme) return t.name === forcedTheme;
            return t.name === (resolvedTheme || theme || defaultTheme);
        }) || themes.find((t) => t.name === "midgard")!;

    // Apply theme to document - using useCallback to ensure stable reference
    const applyTheme = useCallback(
        (themeName: ThemeName) => {
            const root = document.documentElement;

            if (disableTransitionOnChange) {
                document.documentElement.classList.add("disable-transitions");
            }

            // Remove existing theme classes
            root.classList.forEach((className) => {
                if (className.startsWith("theme-")) {
                    root.classList.remove(className);
                }
            });

            // Always add dark class
            if (!root.classList.contains("dark")) {
                root.classList.add("dark");
            }

            // Add theme class
            root.classList.add(`theme-${themeName}`);

            // Set resolved theme
            setResolvedTheme(themeName);

            if (disableTransitionOnChange) {
                // Force a reflow to ensure transitions are disabled
                document.documentElement.offsetHeight;
                requestAnimationFrame(() => {
                    document.documentElement.classList.remove("disable-transitions");
                });
            }

            // Apply theme colors to document meta theme-color for mobile
            const themeObj = themes.find((t) => t.name === themeName);
            if (themeObj) {
                const color = themeObj.color;
                const metaThemeColor = document.querySelector('meta[name="theme-color"]');

                if (metaThemeColor) {
                    metaThemeColor.setAttribute("content", color);
                } else {
                    const newMeta = document.createElement("meta");
                    newMeta.name = "theme-color";
                    newMeta.content = color;
                    document.head.appendChild(newMeta);
                }
            }

            // Dispatch event for components to react to theme change
            window.dispatchEvent(new Event("themechange"));
        },
        [disableTransitionOnChange]
    );

    // Set theme with storage update
    const setTheme = useCallback(
        (newTheme: ThemeName) => {
            if (forcedTheme) return; // Do not allow theme changes when using forced theme

            setThemeState(newTheme);
            try {
                localStorage.setItem(storageKey, newTheme);
            } catch (e) {
                console.error("Failed to save theme preference:", e);
            }
        },
        [forcedTheme, storageKey]
    );

    // Effect for theme synchronization and initial setup
    useEffect(() => {
        if (!mounted) return;

        // Apply forced theme or user preference
        if (forcedTheme) {
            applyTheme(forcedTheme);
        } else if (theme) {
            applyTheme(theme);
        }
    }, [forcedTheme, theme, applyTheme, mounted]);

    // Initialize theme from localStorage or defaults
    useEffect(() => {
        // Only run once on mount
        if (mounted) return;

        // Get stored theme from localStorage
        let storedTheme: ThemeName | null = null;

        try {
            storedTheme = localStorage.getItem(storageKey) as ThemeName;
        } catch (e) {
            console.error("Failed to read theme from localStorage", e);
        }

        // Determine which theme to use - forced theme > stored theme > default theme
        const initialTheme = forcedTheme || storedTheme || defaultTheme;
        setThemeState(initialTheme);

        // Apply the theme immediately to avoid flash
        if (initialTheme && typeof window !== "undefined") {
            applyTheme(initialTheme);
        }

        setMounted(true);
    }, [applyTheme, forcedTheme, storageKey, defaultTheme, mounted]);

    // Inject script to prevent flash
    useEffect(() => {
        if (typeof document === "undefined") return;

        // Remove any existing script
        const existingScript = document.getElementById("theme-script-injected");
        if (existingScript) {
            document.head.removeChild(existingScript);
        }

        // Create and inject the script that runs before page render
        const scriptEl = document.createElement("script");
        scriptEl.id = "theme-script-injected";
        scriptEl.innerHTML = `
            (function() {
                try {
                    const storedTheme = localStorage.getItem('${storageKey}');
                    
                    // Always add dark class first
                    document.documentElement.classList.add('dark');
                    
                    if (storedTheme) {
                        document.documentElement.classList.add('theme-' + storedTheme);
                    } else {
                        document.documentElement.classList.add('theme-${defaultTheme}');
                    }
                } catch (e) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.add('theme-${defaultTheme}');
                }
            })();
        `;
        document.head.appendChild(scriptEl);
    }, [storageKey, defaultTheme]);

    // Avoid hydration mismatch by providing default values
    const safeContextValue = {
        theme: mounted ? theme : undefined,
        setTheme,
        themes,
        currentTheme,
        resolvedTheme: mounted ? resolvedTheme : undefined,
        forcedTheme,
    };

    return <ThemeContext.Provider value={safeContextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

// Add CSS to disable transitions during theme changes
if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.innerHTML = `
        .disable-transitions,
        .disable-transitions * {
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}
