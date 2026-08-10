const themeButton = document.getElementById("theme-toggle");
const body = document.body;

function updateThemeButton(isDark) {
    if (!themeButton) {
        return;
    }
    themeButton.textContent = isDark ? "☀️" : "🌙";
    themeButton.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
}

function applyTheme(theme) {
    if (theme === "dark") {
        body.classList.add("dark");
        updateThemeButton(true);
    } else {
        body.classList.remove("dark");
        updateThemeButton(false);
    }
}

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

if (themeButton) {
    themeButton.addEventListener("click", function () {
        const isDark = body.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateThemeButton(isDark);
    });
}
