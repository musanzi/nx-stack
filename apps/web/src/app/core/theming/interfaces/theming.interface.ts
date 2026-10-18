import type { TonalPalette } from '../palette';

export interface IColors {
  primary: string;
  error: string;
}

export type IThemeConfig = IColors;

export interface IThemePalette {
  primary: TonalPalette;
  error: TonalPalette;
}
