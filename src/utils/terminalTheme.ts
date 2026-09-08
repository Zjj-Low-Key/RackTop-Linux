import type { ITheme } from '@xterm/xterm'

export const TERMINAL_FONT_FAMILY = [
  '"Ubuntu Mono"',
  '"Noto Sans Mono"',
  '"DejaVu Sans Mono"',
  '"Liberation Mono"',
  'monospace',
].join(', ')

export const TERMINAL_THEME: ITheme = {
  background: '#0f1218',
  foreground: '#d7e0ea',
  cursor: '#f5f7fb',
  cursorAccent: '#0f1218',
  selectionBackground: '#36587f',
  selectionForeground: '#ffffff',
  selectionInactiveBackground: '#2b3e58',
  scrollbarSliderBackground: '#ffffff28',
  scrollbarSliderHoverBackground: '#ffffff45',
  scrollbarSliderActiveBackground: '#ffffff5e',
  black: '#161b22',
  red: '#ff7b72',
  green: '#7ee787',
  yellow: '#f2cc60',
  blue: '#79c0ff',
  magenta: '#d2a8ff',
  cyan: '#76e3ea',
  white: '#d7e0ea',
  brightBlack: '#6e7681',
  brightRed: '#ffa198',
  brightGreen: '#a5d6a7',
  brightYellow: '#f8e3a1',
  brightBlue: '#a5d6ff',
  brightMagenta: '#e2c5ff',
  brightCyan: '#b3f0f2',
  brightWhite: '#f0f6fc',
}
