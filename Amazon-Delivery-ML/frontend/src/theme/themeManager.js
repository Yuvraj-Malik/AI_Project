const THEME_KEY = "asci_theme";

function prefersDarkMode() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getStoredThemeMode() {
    return localStorage.getItem(THEME_KEY) || "corporate";
}

export function setStoredThemeMode(mode) {
    localStorage.setItem(THEME_KEY, mode);
}

export function resolveTheme(mode) {
    if (mode === "corporate") {
        return prefersDarkMode() ? "dark" : "light";
    }
    return mode === "dark" ? "dark" : "light";
}

export function applyThemeMode(mode) {
    const resolved = resolveTheme(mode);
    document.documentElement.setAttribute("data-theme", resolved);
    return resolved;
}

export function initializeThemeSync() {
    applyThemeMode(getStoredThemeMode());

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
        if (getStoredThemeMode() === "corporate") {
            applyThemeMode("corporate");
        }
    };

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", onSystemThemeChange);
    } else {
        mediaQuery.addListener(onSystemThemeChange);
    }

    return () => {
        if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener("change", onSystemThemeChange);
        } else {
            mediaQuery.removeListener(onSystemThemeChange);
        }
    };
}
