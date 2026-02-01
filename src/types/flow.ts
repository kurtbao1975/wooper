import type { Node, Edge } from 'reactflow'

// Component categories
export type ComponentCategory =
  | 'browser'
  | 'interaction'
  | 'data'
  | 'flow'
  | 'desktop'
  | 'advanced'

// Component definition
export interface ComponentDefinition {
  type: string
  category: ComponentCategory
  name: string
  nameZh: string
  icon: string
  description: string
  descriptionZh: string
  defaultProps: Record<string, unknown>
  propsSchema: PropsSchema
  inputs: PortDefinition[]
  outputs: PortDefinition[]
}

export interface PropsSchema {
  type: 'object'
  properties: Record<string, PropertySchema>
  required?: string[]
}

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'select'
  title: string
  titleZh: string
  description?: string
  default?: unknown
  enum?: string[]
  enumLabels?: string[]
  placeholder?: string
}

export interface PortDefinition {
  id: string
  name: string
  type: 'flow' | 'data'
}

// Node data
export interface FlowNodeData {
  type: string
  name: string
  props: Record<string, unknown>
  status?: 'idle' | 'running' | 'success' | 'error'
  error?: string
}

export type FlowNode = Node<FlowNodeData>
export type FlowEdge = Edge

// Flow definition for saving/loading
export interface FlowDefinition {
  id: string
  name: string
  description: string
  version: string
  created: string
  updated: string
  nodes: FlowNode[]
  edges: FlowEdge[]
  variables: Variable[]
  config: FlowConfig
}

export interface Variable {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  value: unknown
  description?: string
}

export interface FlowConfig {
  timeout: number
  retryCount: number
  headless: boolean
  screenshotOnError: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

// Execution
export interface ExecutionContext {
  flowId: string
  variables: Map<string, unknown>
  logs: LogEntry[]
  screenshots: Screenshot[]
  startTime: Date
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error'
  currentNodeId?: string
}

export interface LogEntry {
  id: string
  timestamp: Date
  level: 'debug' | 'info' | 'warn' | 'error'
  nodeId?: string
  nodeName?: string
  message: string
  data?: unknown
}

export interface Screenshot {
  id: string
  timestamp: Date
  nodeId: string
  data: string // base64
}

// Execution result
export interface ExecutionResult {
  success: boolean
  startTime: Date
  endTime: Date
  duration: number
  output?: unknown
  error?: string
  logs: LogEntry[]
  screenshots: Screenshot[]
}
