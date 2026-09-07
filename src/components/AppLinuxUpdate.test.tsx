// @vitest-environment jsdom

import { StrictMode, act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { api } from '../services/api'

vi.mock('./SshTerminal', () => ({ SshTerminal: () => null }))

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

class ResizeObserverStub implements ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {}
  observe(_target: Element, _options?: ResizeObserverOptions) {}
  unobserve(_target: Element) {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub
Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
})

let root: ReturnType<typeof createRoot> | null = null

afterEach(() => {
  if (root) act(() => root?.unmount())
  root = null
  document.body.innerHTML = ''
  localStorage.clear()
  vi.restoreAllMocks()
})


vi.mock('../utils/platform', () => ({ detectAppPlatform: () => 'linux' }))

it('opens the Linux release download without invoking native installation', async () => {
  const url = 'https://github.com/Zjj-Low-Key/RackTop-Linux/releases/tag/v99.0.0'
  vi.spyOn(api, 'getLatestRelease').mockResolvedValue({ version: '99.0.0', url })
  const open = vi.spyOn(window, 'open').mockReturnValue(null)
  const container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  await act(async () => { root?.render(<App />); await Promise.resolve() })
  const download = container.querySelector<HTMLButtonElement>('button[aria-label="下载 RackTop 99.0.0"]')
  expect(download).not.toBeNull()
  await act(async () => { download?.click(); await Promise.resolve() })
  expect(open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer')
  expect(container.textContent).not.toContain('正在下载更新')
})
