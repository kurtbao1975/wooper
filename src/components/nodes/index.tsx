import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Play,
  Flag,
  MousePointer,
  Type,
  Clock,
  GitBranch,
  Repeat,
  Globe,
  Table,
  Download,
  Code,
} from 'lucide-react'
import type { FlowNodeData } from '@/types/flow'

const iconMap: Record<string, React.ReactNode> = {
  start: <Play className="w-4 h-4" />,
  end: <Flag className="w-4 h-4" />,
  click: <MousePointer className="w-4 h-4" />,
  input: <Type className="w-4 h-4" />,
  wait: <Clock className="w-4 h-4" />,
  condition: <GitBranch className="w-4 h-4" />,
  loop: <Repeat className="w-4 h-4" />,
  navigate: <Globe className="w-4 h-4" />,
  extract: <Table className="w-4 h-4" />,
  download: <Download className="w-4 h-4" />,
  script: <Code className="w-4 h-4" />,
}

const statusColors = {
  idle: 'border-border',
  running: 'border-blue-500 node-running',
  success: 'border-green-500',
  error: 'border-red-500',
}

// Start Node
export const StartNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div
      className={`
        px-4 py-2 rounded-full bg-green-100 border-2
        ${selected ? 'border-green-500' : 'border-green-300'}
        ${data.status ? statusColors[data.status] : ''}
      `}
    >
      <div className="flex items-center gap-2">
        <Play className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">{data.name}</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  )
})
StartNode.displayName = 'StartNode'

// End Node
export const EndNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div
      className={`
        px-4 py-2 rounded-full bg-red-100 border-2
        ${selected ? 'border-red-500' : 'border-red-300'}
        ${data.status ? statusColors[data.status] : ''}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-red-500"
      />
      <div className="flex items-center gap-2">
        <Flag className="w-4 h-4 text-red-600" />
        <span className="text-sm font-medium text-red-800">{data.name}</span>
      </div>
    </div>
  )
})
EndNode.displayName = 'EndNode'

// Action Node (Generic)
export const ActionNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const icon = iconMap[data.type] || <Code className="w-4 h-4" />

  return (
    <div
      className={`
        min-w-[160px] bg-card rounded-lg border-2 shadow-sm
        ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
        ${data.status ? statusColors[data.status] : ''}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-muted-foreground"
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-t-lg border-b border-border">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {data.type}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2">
        <div className="text-sm font-medium truncate">{data.name}</div>
        {data.props?.selector && (
          <div className="text-xs text-muted-foreground truncate mt-1">
            {String(data.props.selector)}
          </div>
        )}
        {data.error && (
          <div className="text-xs text-red-500 mt-1 truncate">{data.error}</div>
        )}
      </div>

      {/* Status indicator */}
      {data.status === 'running' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      )}
      {data.status === 'success' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
      )}
      {data.status === 'error' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-muted-foreground"
      />
    </div>
  )
})
ActionNode.displayName = 'ActionNode'

// Condition Node
export const ConditionNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div
      className={`
        min-w-[160px] bg-card rounded-lg border-2 shadow-sm
        ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
        ${data.status ? statusColors[data.status] : ''}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-muted-foreground"
      />

      <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-t-lg border-b border-border">
        <GitBranch className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-medium text-amber-700 uppercase">条件</span>
      </div>

      <div className="px-3 py-2">
        <div className="text-sm font-medium truncate">{data.name}</div>
      </div>

      {/* True/False outputs */}
      <div className="flex justify-between px-3 pb-2 text-xs text-muted-foreground">
        <span>是</span>
        <span>否</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '30%' }}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '70%' }}
        className="w-3 h-3 bg-red-500"
      />
    </div>
  )
})
ConditionNode.displayName = 'ConditionNode'

// Loop Node
export const LoopNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div
      className={`
        min-w-[180px] bg-card rounded-lg border-2 shadow-sm
        ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
        ${data.status ? statusColors[data.status] : ''}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-muted-foreground"
      />

      <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-t-lg border-b border-border">
        <Repeat className="w-4 h-4 text-purple-600" />
        <span className="text-xs font-medium text-purple-700 uppercase">循环</span>
      </div>

      <div className="px-3 py-2">
        <div className="text-sm font-medium truncate">{data.name}</div>
        {data.props?.count && (
          <div className="text-xs text-muted-foreground mt-1">
            次数: {String(data.props.count)}
          </div>
        )}
      </div>

      {/* Loop body and exit */}
      <div className="flex justify-between px-3 pb-2 text-xs text-muted-foreground">
        <span>循环体</span>
        <span>退出</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="body"
        style={{ left: '30%' }}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="exit"
        style={{ left: '70%' }}
        className="w-3 h-3 bg-muted-foreground"
      />
    </div>
  )
})
LoopNode.displayName = 'LoopNode'

// Export node types map for ReactFlow
export const nodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
  loopNode: LoopNode,
}
