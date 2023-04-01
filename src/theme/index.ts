import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

import { globalStyles as styles } from "./styles";

const tokensDark = {
  primary: {
    0: "#ffffff",
    10: "#ffffff",
    50: "#ffffff",
    100: "#d3d4de",
    200: "#a6a9be",
    300: "#7a7f9d",
    400: "#4d547d",
    500: "#21295c",
    600: "#191F45",
    700: "#141937",
    800: "#0d1025",
    900: "#070812",
  },
  neutral: {
    0: "#ffffff",
    10: "#f6f6f6",
    50: "#f0f0f0",
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000",
  },
  accent: {
    0: "#ffffff",
    10: "#ffffff",
    50: "#f0f0f0",
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
} as const;

const tokensLight = {
  primary: {
    0: "#ffffff",
    10: "#ffffff",
    50: "#ffffff",
    100: "#070812",
    200: "#0d1025",
    300: "#141937",
    400: "#191F45",
    500: "#21295c",
    600: "#4d547d",
    700: "#7a7f9d",
    800: "#a6a9be",
    900: "#d3d4de",
  },
  neutral: {
    0: "#000000",
    10: "#141414",
    50: "#3d3d3d",
    100: "#666666",
    200: "#858585",
    300: "#a3a3a3",
    400: "#c2c2c2",
    500: "#e0e0e0",
    600: "#f0f0f0",
    700: "#f6f6f6",
    800: "#ffffff",
    900: "#ffffff",
    1000: "#ffffff",
  },
  accent: {
    0: "#ffffff",
    10: "#ffffff",
    50: "#332a14",
    100: "#665429",
    200: "#997d3d",
    300: "#cca752",
    400: "#ffd166",
    500: "#ffda85",
    600: "#ffe3a3",
    700: "#ffedc2",
    800: "#fff6e0",
    900: "#f0f0f0",
  },
} as const;

/**
 * Generates color semantic tokens from a set of dark and light color tokens.
 * @param darkTokens - The set of dark color tokens.
 * @param lightTokens - The set of light color tokens.
 * @returns {Record<string, { _light: string; _dark: string }>} A record of color semantic tokens, keyed by semantic token name.
 *
 * @example
 * // Generate color semantic tokens for the primary color
 * const primaryTokens = generateColorSemanticTokens(tokensDark.primary, tokensLight.primary);
 * // primaryTokens = {
 * //   "primary-0": { _light: "#F4F4F4", _dark: "#000000" },
 * //   "primary-10": { _light: "#E6E6E6", _dark: "#1A1A1A" },
 * //   "primary-50": { _light: "#B3B3B3", _dark: "#4D4D4D" },
 * //   ...
 * // }
 */

function generateColorSemanticTokens(
  darkTokens: typeof tokensDark,
  lightTokens: typeof tokensLight
) {
  type Tokens = typeof tokensDark;
  type ColorKey = keyof Tokens;
  type ShadeKey = keyof Tokens["neutral"];

  const colorKeys = Object.keys(tokensDark) as ColorKey[];

  const result: Record<string, { _light: string; _dark: string }> = {};

  colorKeys.forEach((colorKey) => {
    // convert each string key to a number to have correct assertion for TS
    const shades = Object.keys(darkTokens[colorKey]).map(Number) as Array<
      keyof (typeof darkTokens)[typeof colorKey] & ShadeKey
    >;

    shades.forEach((shadeKey) => {
      const lightColor = lightTokens[colorKey][shadeKey];
      const darkColor = darkTokens[colorKey][shadeKey];

      const semanticTokenKey = `${colorKey}-${shadeKey}`;

      result[semanticTokenKey] = {
        _light: lightColor,
        _dark: darkColor,
      };
    });
  });

  return result;
}

const colorsSemanticTokens = generateColorSemanticTokens(
  tokensDark,
  tokensLight
);

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const fonts = {
  heading: ["Inter", "sans-serif"].join(","),
  body: ["Inter", "sans-serif"].join(","),
};

const theme = extendTheme({
  config,
  semanticTokens: {
    colors: {
      ...colorsSemanticTokens,
      "primary-emphasis": {
        _light: tokensDark.neutral[50],
        _dark: tokensDark.primary[400],
      },
      "accent-emphasis": {
        _light: tokensDark.accent[600],
        _dark: tokensDark.accent[300],
      },
      "accent-subtle": {
        _light: tokensDark.accent[700],
        _dark: tokensDark.accent[400],
      },
      "neutral-emphasis": {
        _light: tokensDark.primary[500],
        _dark: tokensDark.neutral[500],
      },
      "background-emphasis": {
        _light: tokensDark.neutral[50],
        _dark: tokensDark.primary[500],
      },
    },
  },
  fonts,
  styles,
});

export default theme;
