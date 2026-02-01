/**
 * Playwright Executor - Bridge between Flow Engine and Playwright
 *
 * This module handles the actual Playwright operations.
 * In Electron, it communicates with the main process via IPC.
 * In browser/web mode, it can work with a backend service.
 */

export interface BrowserContext {
  browserId: string
  pageId: string
}

export interface ElementSelector {
  type: 'css' | 'xpath' | 'text' | 'role' | 'testId'
  value: string
}

export interface ClickOptions {
  button?: 'left' | 'right' | 'middle'
  clickCount?: number
  delay?: number
  position?: { x: number; y: number }
}

export interface InputOptions {
  delay?: number
  clear?: boolean
}

export interface WaitOptions {
  state?: 'visible' | 'hidden' | 'attached' | 'detached'
  timeout?: number
}

export interface ScreenshotOptions {
  fullPage?: boolean
  path?: string
  type?: 'png' | 'jpeg'
  quality?: number
}

export interface NavigationOptions {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'
  timeout?: number
}

export class PlaywrightExecutor {
  private context: BrowserContext | null = null
  private isElectron: boolean

  constructor() {
    this.isElectron = typeof window !== 'undefined' && !!window.electronAPI
  }

  /**
   * Launch a new browser instance
   */
  async launchBrowser(options?: {
    browser?: 'chromium' | 'firefox' | 'webkit'
    headless?: boolean
  }): Promise<BrowserContext> {
    if (this.isElectron) {
      const result = await window.electronAPI.playwright.launch({
        headless: options?.headless ?? false,
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to launch browser')
      }

      this.context = {
        browserId: result.browserId!,
        pageId: 'default',
      }

      return this.context
    }

    // Fallback for non-electron environment (simulation)
    console.log('[PlaywrightExecutor] Simulating browser launch:', options)
    this.context = {
      browserId: `browser-${Date.now()}`,
      pageId: 'page-1',
    }
    return this.context
  }

  /**
   * Navigate to a URL
   */
  async navigate(url: string, options?: NavigationOptions): Promise<void> {
    this.ensureContext()
    console.log(`[PlaywrightExecutor] Navigate to: ${url}`, options)

    if (this.isElectron) {
      // Would call IPC to main process
      await this.executeInMain('navigate', { url, options })
    }
  }

  /**
   * Click on an element
   */
  async click(selector: string | ElementSelector, options?: ClickOptions): Promise<void> {
    this.ensureContext()
    const selectorStr = typeof selector === 'string' ? selector : selector.value
    console.log(`[PlaywrightExecutor] Click: ${selectorStr}`, options)

    if (this.isElectron) {
      await this.executeInMain('click', { selector: selectorStr, options })
    }
  }

  /**
   * Type text into an element
   */
  async type(
    selector: string | ElementSelector,
    text: string,
    options?: InputOptions
  ): Promise<void> {
    this.ensureContext()
    const selectorStr = typeof selector === 'string' ? selector : selector.value
    console.log(`[PlaywrightExecutor] Type into ${selectorStr}: ${text}`)

    if (options?.clear) {
      await this.clear(selector)
    }

    if (this.isElectron) {
      await this.executeInMain('type', { selector: selectorStr, text, options })
    }
  }

  /**
   * Clear an input field
   */
  async clear(selector: string | ElementSelector): Promise<void> {
    this.ensureContext()
    const selectorStr = typeof selector === 'string' ? selector : selector.value
    console.log(`[PlaywrightExecutor] Clear: ${selectorStr}`)

    if (this.isElectron) {
      await this.executeInMain('clear', { selector: selectorStr })
    }
  }

  /**
   * Hover over an element
   */
  async hover(selector: string | ElementSelector): Promise<void> {
    this.ensureContext()
    const selectorStr = typeof selector === 'string' ? selector : selector.value
    console.log(`[PlaywrightExecutor] Hover: ${selectorStr}`)

    if (this.isElectron) {
      await this.executeInMain('hover', { selector: selectorStr })
    }
  }

  /**
   * Wait for an element
   */
  async waitForSelector(
    selector: string | ElementSelector,
    options?: WaitOptions
  ): Promise<void> {
    this.ensureContext()
    const selectorStr = typeof selector === 'string' ? selector : selector.value
    console.log(`[PlaywrightExecutor] Wait for: ${selectorStr}`, options)

    if (this.isElectron) {
      await this.executeInMain('waitForSelector', {
        selector: selectorStr,
        options,
      })
    }
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(options?: NavigationOptions): Promise<void> {
    this.ensureContext()
    console.log(`[PlaywrightExecutor] Wait for navigation`, options)

    if (this.isElectron) {
      await this.executeInMain('waitForNavigation', { options })
    }
  }

  /**
   * Get text content from an element
   */
  async getText(selector: string | ElementSelector): Promise<string> {
    this.ensureContext()
    const selectorStr = typeof selector === 'string' ? selector : selector.value
    console.log(`[PlaywrightExecutor] Get text: ${selectorStr}`)

    if (this.isElectron) {
      const result = await this.executeInMain('getText', { selector: selectorStr })
      return result.text
    }

    return 'Sample text content'
  }

  /**
   * Get attribute from an element
   */
  async getAttribute(
    selector: string | ElementSelector,
    attribute: string
  ): Promise<string | null> {
    this.ensureContext()
    const selectorStr = typeof selector === 'string' ? selector : selector.value
    console.log(`[PlaywrightExecutor] Get attribute ${attribute} from: ${selectorStr}`)

    if (this.isElectron) {
      const result = await this.executeInMain('getAttribute', {
        selector: selectorStr,
        attribute,
      })
      return result.value
    }

    return 'sample-value'
  }

  /**
   * Take a screenshot
   */
  async screenshot(options?: ScreenshotOptions): Promise<string> {
    this.ensureContext()
    console.log(`[PlaywrightExecutor] Screenshot`, options)

    if (this.isElectron) {
      const result = await this.executeInMain('screenshot', { options })
      return result.data
    }

    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  }

  /**
   * Execute JavaScript in the page
   */
  async evaluate<T>(script: string): Promise<T> {
    this.ensureContext()
    console.log(`[PlaywrightExecutor] Evaluate script`)

    if (this.isElectron) {
      const result = await this.executeInMain('evaluate', { script })
      return result.value as T
    }

    return undefined as T
  }

  /**
   * Select an option from a dropdown
   */
  async select(
    selector: string | ElementSelector,
    value: string | string[]
  ): Promise<void> {
    this.ensureContext()
    const selectorStr = typeof selector === 'string' ? selector : selector.value
    console.log(`[PlaywrightExecutor] Select ${value} from: ${selectorStr}`)

    if (this.isElectron) {
      await this.executeInMain('select', { selector: selectorStr, value })
    }
  }

  /**
   * Close the browser
   */
  async close(): Promise<void> {
    if (this.context) {
      console.log(`[PlaywrightExecutor] Close browser: ${this.context.browserId}`)

      if (this.isElectron) {
        await this.executeInMain('close', {})
      }

      this.context = null
    }
  }

  /**
   * Execute a command in the main process (Electron only)
   */
  private async executeInMain(
    command: string,
    params: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    if (!this.isElectron) {
      // Simulate delay for non-electron environment
      await new Promise((resolve) => setTimeout(resolve, 100))
      return {}
    }

    const script = JSON.stringify({ command, params, context: this.context })
    const result = await window.electronAPI.playwright.execute(script)

    if (!result.success) {
      throw new Error(result.error || `Command failed: ${command}`)
    }

    return result as Record<string, unknown>
  }

  private ensureContext(): void {
    if (!this.context) {
      throw new Error('Browser not launched. Call launchBrowser() first.')
    }
  }
}

// Export singleton instance
export const playwrightExecutor = new PlaywrightExecutor()
