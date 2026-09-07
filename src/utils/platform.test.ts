import { describe, expect, it } from 'vitest'
import { detectAppPlatform } from './platform'

describe('detectAppPlatform', () => {
  it('keeps browser previews platform neutral', () => {
    expect(detectAppPlatform(false, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('web')
  })

  it('detects a Windows Tauri WebView', () => {
    expect(detectAppPlatform(true, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')).toBe('windows')
  })

  it('detects a macOS Tauri WebView', () => {
    expect(detectAppPlatform(true, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')).toBe('macos')
  })
})


it('detects Linux WebKit without applying the macOS shell', () => {
  expect(detectAppPlatform(true, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15')).toBe('linux')
  expect(detectAppPlatform(false, 'Mozilla/5.0 (X11; Linux x86_64)')).toBe('web')
})
