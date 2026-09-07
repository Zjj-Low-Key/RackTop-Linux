export type AppPlatform = 'macos' | 'windows' | 'linux' | 'web'

export function detectAppPlatform(isDesktop: boolean, userAgent: string): AppPlatform {
  if (!isDesktop) return 'web'
  if (/Windows/i.test(userAgent)) return 'windows'
  if (/Linux/i.test(userAgent)) return 'linux'
  return 'macos'
}

