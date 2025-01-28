import { useThemeStore } from "@/stores/theme";

export const getContrastYIQ = function (hexcolor: string) {
  hexcolor = getHexColor(hexcolor);
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);

  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  return brightness > 230 || (r > 200 && g > 200 && b < 150)
    ? "black"
    : "white";
};

export const getHexColor = function getHexColor(color: string) {
  const themeStore = useThemeStore();
  const theme = themeStore.isThemeDark ? "dark" : "light";

  const colorMap = {
    success: themeStore.$state.colors[theme].success,
    danger: themeStore.$state.colors[theme].error,
    warning: themeStore.$state.colors[theme].warning,
    info: themeStore.$state.colors[theme].info,
    default: themeStore.$state.colors[theme].primary,
    primary: themeStore.$state.colors[theme].primary,
    secondary: themeStore.$state.colors[theme].secondary1,
  };

  const hexColor = colorMap[color as keyof typeof colorMap] || color;
  const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(hexColor);
  return isHex ? hexColor : "#000000";
};
