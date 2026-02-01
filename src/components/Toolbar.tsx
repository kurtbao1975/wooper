import { useState } from 'react'
import {
  Play,
  Pause,
  Square,
  Bug,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Settings,
  MessageSquare,
  Terminal,
  Video,
  Wand2,
} from 'lucide-react'
import { useFlowStore } from '@/stores/flowStore'
import { useFlowExecution } from '@/hooks/useFlowExecution'
import { RecordingDialog, RecordedStep } from './dialogs/RecordingDialog'
import { NaturalLanguageDialog, GeneratedStep } from './dialogs/NaturalLanguageDialog'

export function Toolbar() {
  const {
    toggleCopilot,
    toggleConsole,
    copilotOpen,
    consoleOpen,
    addNode,
    nodes,
  } = useFlowStore()

  const { run, pause, resume, stop, isRunning, isPaused } = useFlowExecution()

  const [recordingDialogOpen, setRecordingDialogOpen] = useState(false)
  const [nlDialogOpen, setNlDialogOpen] = useState(false)

  const handleRecordingComplete = (steps: RecordedStep[]) => {
    // Convert recorded steps to flow nodes
    let yPos = 150
    steps.forEach((step, index) => {
      const nodeType = mapRecordedStepToNodeType(step.type)
      addNode({
        id: `recorded-${Date.now()}-${index}`,
        type: 'actionNode',
        position: { x: 250, y: yPos },
        data: {
          type: nodeType,
          name: getStepName(step),
          props: step.data,
        },
      })
      yPos += 100
    })
  }

  const handleNLGenerate = (steps: GeneratedStep[]) => {
    // Convert generated steps to flow nodes
    let yPos = 150
    steps.forEach((step, index) => {
      const nodeTypeMap: Record<string, string> = {
        openBrowser: 'actionNode',
        navigate: 'actionNode',
        click: 'actionNode',
        input: 'actionNode',
        wait: 'actionNode',
        waitForElement: 'actionNode',
        getText: 'actionNode',
        loop: 'loopNode',
        condition: 'conditionNode',
      }

      addNode({
        id: `generated-${Date.now()}-${index}`,
        type: nodeTypeMap[step.type] || 'actionNode',
        position: { x: 250, y: yPos },
        data: {
          type: step.type,
          name: step.name,
          props: step.props,
        },
      })
      yPos += 100
    })
  }

  const handleSave = () => {
    const flowData = {
      nodes: nodes,
      edges: useFlowStore.getState().edges,
      variables: useFlowStore.getState().variables,
      version: '1.0',
      updated: new Date().toISOString(),
    }
    const json = JSON.stringify(flowData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flow-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="h-12 border-b border-border bg-card flex items-center px-4 gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2 pr-4 border-r border-border">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">W</span>
          </div>
          <span className="font-semibold text-sm">Wooper RPA</span>
        </div>

        {/* Execution Controls */}
        <div className="flex items-center gap-1 px-2">
          {!isRunning ? (
            <ToolbarButton
              icon={<Play className="w-4 h-4" />}
              label="运行"
              onClick={run}
            />
          ) : (
            <>
              {isPaused ? (
                <ToolbarButton
                  icon={<Play className="w-4 h-4" />}
                  label="继续"
                  onClick={resume}
                />
              ) : (
                <ToolbarButton
                  icon={<Pause className="w-4 h-4" />}
                  label="暂停"
                  onClick={pause}
                />
              )}
              <ToolbarButton
                icon={<Square className="w-4 h-4" />}
                label="停止"
                onClick={stop}
                variant="destructive"
              />
            </>
          )}
          <ToolbarButton
            icon={<Bug className="w-4 h-4" />}
            label="调试"
            onClick={() => {}}
          />
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Edit Controls */}
        <div className="flex items-center gap-1 px-2">
          <ToolbarButton
            icon={<Undo2 className="w-4 h-4" />}
            label="撤销"
            onClick={() => {}}
          />
          <ToolbarButton
            icon={<Redo2 className="w-4 h-4" />}
            label="重做"
            onClick={() => {}}
          />
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Generation Modes */}
        <div className="flex items-center gap-1 px-2">
          <ToolbarButton
            icon={<Video className="w-4 h-4" />}
            label="录屏生成"
            onClick={() => setRecordingDialogOpen(true)}
          />
          <ToolbarButton
            icon={<Wand2 className="w-4 h-4" />}
            label="AI生成"
            onClick={() => setNlDialogOpen(true)}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Controls */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={<Save className="w-4 h-4" />}
            label="保存"
            onClick={handleSave}
          />
          <ToolbarButton
            icon={<FolderOpen className="w-4 h-4" />}
            label="打开"
            onClick={() => {}}
          />

          <div className="w-px h-6 bg-border mx-2" />

          <ToolbarButton
            icon={<Terminal className="w-4 h-4" />}
            label="控制台"
            onClick={toggleConsole}
            active={consoleOpen}
          />
          <ToolbarButton
            icon={<MessageSquare className="w-4 h-4" />}
            label="Copilot"
            onClick={toggleCopilot}
            active={copilotOpen}
          />
          <ToolbarButton
            icon={<Settings className="w-4 h-4" />}
            label="设置"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Dialogs */}
      <RecordingDialog
        open={recordingDialogOpen}
        onClose={() => setRecordingDialogOpen(false)}
        onComplete={handleRecordingComplete}
      />
      <NaturalLanguageDialog
        open={nlDialogOpen}
        onClose={() => setNlDialogOpen(false)}
        onGenerate={handleNLGenerate}
      />
    </>
  )
}

function mapRecordedStepToNodeType(type: string): string {
  const typeMap: Record<string, string> = {
    navigate: 'navigate',
    click: 'click',
    input: 'input',
    scroll: 'scroll',
    select: 'select',
  }
  return typeMap[type] || type
}

function getStepName(step: RecordedStep): string {
  switch (step.type) {
    case 'navigate':
      return `导航到 ${step.data.url}`
    case 'click':
      return `点击 ${step.data.selector}`
    case 'input':
      return `输入 "${step.data.text}"`
    case 'scroll':
      return '滚动页面'
    case 'select':
      return `选择 ${step.data.value}`
    default:
      return step.type
  }
}

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'destructive'
  active?: boolean
}

function ToolbarButton({ icon, label, onClick, variant = 'default', active }: ToolbarButtonProps) {
  const baseClasses = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm transition-colors'
  const variantClasses = {
    default: active
      ? 'bg-primary text-primary-foreground'
      : 'hover:bg-accent text-muted-foreground hover:text-foreground',
    destructive: 'hover:bg-destructive hover:text-destructive-foreground text-muted-foreground',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      title={label}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  )
}
