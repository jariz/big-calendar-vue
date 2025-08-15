import { ref, onMounted, onUnmounted } from "vue";

export function useTheme() {
  const isDark = ref(false);

  // Get system preference
  const getSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  // Apply system theme to document
  const applySystemTheme = () => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    const systemTheme = getSystemTheme();
    root.classList.add(systemTheme);
    isDark.value = systemTheme === "dark";
  };

  // Handle system theme changes
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    isDark.value = e.matches;
    applySystemTheme();
  };

  // Initialize theme on mount
  onMounted(() => {
    // Always use system theme
    applySystemTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Cleanup listener on unmount
    onUnmounted(() => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    });
  });

  return {
    isDark,
    getSystemTheme,
  };
}
