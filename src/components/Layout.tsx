import { Toolbar } from './Toolbar'
import { ComponentPalette } from './ComponentPalette'
import { Canvas } from './Canvas'
import { PropertiesPanel } from './PropertiesPanel'
import { Console } from './Console'
import { CopilotPanel } from './CopilotPanel'
import { useFlowStore } from '@/stores/flowStore'

export function Layout() {
  const { copilotOpen, consoleOpen } = useFlowStore()

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Component Palette */}
        <ComponentPalette />

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <Canvas />
          </div>

          {/* Bottom - Console */}
          {consoleOpen && (
            <div className="h-48 border-t border-border">
              <Console />
            </div>
          )}
        </div>

        {/* Right Panel - Properties & Copilot */}
        <div className="w-80 border-l border-border flex flex-col">
          <div className="flex-1 overflow-hidden">
            <PropertiesPanel />
          </div>

          {copilotOpen && (
            <div className="h-80 border-t border-border">
              <CopilotPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
