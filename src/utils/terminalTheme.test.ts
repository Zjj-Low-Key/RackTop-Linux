import { describe, expect, it } from 'vitest'
import { TERMINAL_FONT_FAMILY, TERMINAL_THEME } from './terminalTheme'

function luminance(hex: string) {
  const channels = hex.slice(1, 7).match(/.{2}/g)?.map((channel) => Number.parseInt(channel, 16) / 255) ?? []
  return channels.reduce((sum, channel, index) => {
    const linear = channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    return sum + linear * [0.2126, 0.7152, 0.0722][index]
  }, 0)
}

function contrast(first: string, second: string) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('terminal theme', () => {
  it('uses a readable Linux monospace fallback chain', () => {
    expect(TERMINAL_FONT_FAMILY.startsWith('"Ubuntu Mono"')).toBe(true)
    expect(TERMINAL_FONT_FAMILY).toContain('DejaVu Sans Mono')
    expect(TERMINAL_FONT_FAMILY).toContain('Noto Sans Mono')
    expect(TERMINAL_FONT_FAMILY.endsWith('monospace')).toBe(true)
  })

  it('keeps semantic ANSI colors distinguishable from the terminal surface', () => {
    const semanticColors = [TERMINAL_THEME.foreground, TERMINAL_THEME.green, TERMINAL_THEME.blue, TERMINAL_THEME.yellow, TERMINAL_THEME.red]
    expect(semanticColors.every((color) => color && contrast(color, TERMINAL_THEME.background ?? '#000000') >= 3)).toBe(true)
    expect(new Set(semanticColors).size).toBe(semanticColors.length)
  })
})
