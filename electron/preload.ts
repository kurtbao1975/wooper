import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Playwright execution
  playwright: {
    launch: (options?: { headless?: boolean }) =>
      ipcRenderer.invoke('playwright:launch', options),
    execute: (script: string) =>
      ipcRenderer.invoke('playwright:execute', script),
  },

  // Window controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },

  // File operations
  file: {
    save: (data: string, filename: string) =>
      ipcRenderer.invoke('file:save', data, filename),
    open: () =>
      ipcRenderer.invoke('file:open'),
  },

  // Event listeners
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args))
  },
  off: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, callback)
  },
})

// Type declarations for the exposed API
declare global {
  interface Window {
    electronAPI: {
      playwright: {
        launch: (options?: { headless?: boolean }) => Promise<{ success: boolean; browserId?: string; error?: string }>
        execute: (script: string) => Promise<{ success: boolean; error?: string }>
      }
      window: {
        minimize: () => Promise<void>
        maximize: () => Promise<void>
        close: () => Promise<void>
      }
      file: {
        save: (data: string, filename: string) => Promise<{ success: boolean; path?: string }>
        open: () => Promise<{ success: boolean; data?: string; path?: string }>
      }
      on: (channel: string, callback: (...args: unknown[]) => void) => void
      off: (channel: string, callback: (...args: unknown[]) => void) => void
    }
  }
}
