export enum Layout {
  VerticalNav = "VerticalNav",
  HorizontalNav = "HorizontalNav",
  Blank = "Blank",
  Landing = "Landing",
}

export enum RouterTransition {
  Fade = "fade",
  FadeUp = "fade-up",
  FadeBottom = "fade-bottom",
  FadeLeft = "fade-left",
  FadeRight = "fade-right",
}

export enum ThemeEnum {
  Dark = "dark",
  Light = "light",
}

export type Theme = "light" | "dark";

export type ThemeName = ThemeEnum | Theme;

export type ColorType = "primary" | "info" | "success" | "warning" | "error";
export type ColorScene = "" | "Suppl" | "Hover" | "Pressed";
export type ColorKey = `${ColorType}Color${ColorScene}`;
export type ThemeColor = Partial<Record<ColorKey, string>>;

export interface ColorAction {
  scene: ColorScene;
  handler: (color: string) => string;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}
