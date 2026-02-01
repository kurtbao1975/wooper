import { create } from 'zustand'
import {
  Connection,
  EdgeChange,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow'
import type { FlowNode, FlowEdge, FlowNodeData, Variable, ExecutionContext, LogEntry } from '@/types/flow'

interface FlowState {
  // Flow data
  nodes: FlowNode[]
  edges: FlowEdge[]
  variables: Variable[]

  // Selection
  selectedNodeId: string | null
  selectedEdgeId: string | null

  // Execution state
  execution: ExecutionContext | null
  isRunning: boolean
  isPaused: boolean

  // UI state
  copilotOpen: boolean
  consoleOpen: boolean

  // Actions
  setNodes: (nodes: FlowNode[]) => void
  setEdges: (edges: FlowEdge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void

  addNode: (node: FlowNode) => void
  updateNodeData: (nodeId: string, data: Partial<FlowNodeData>) => void
  deleteNode: (nodeId: string) => void

  selectNode: (nodeId: string | null) => void
  selectEdge: (edgeId: string | null) => void

  // Variables
  addVariable: (variable: Variable) => void
  updateVariable: (id: string, updates: Partial<Variable>) => void
  deleteVariable: (id: string) => void

  // Execution
  startExecution: () => void
  pauseExecution: () => void
  resumeExecution: () => void
  stopExecution: () => void
  setCurrentNode: (nodeId: string) => void
  setNodeStatus: (nodeId: string, status: FlowNodeData['status'], error?: string) => void
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void

  // UI
  toggleCopilot: () => void
  toggleConsole: () => void

  // Flow management
  clearFlow: () => void
  loadFlow: (nodes: FlowNode[], edges: FlowEdge[], variables?: Variable[]) => void
}

const initialNodes: FlowNode[] = [
  {
    id: 'start',
    type: 'startNode',
    position: { x: 250, y: 50 },
    data: { type: 'start', name: '开始', props: {} },
    deletable: false,
  },
  {
    id: 'end',
    type: 'endNode',
    position: { x: 250, y: 400 },
    data: { type: 'end', name: '结束', props: {} },
    deletable: false,
  },
]

export const useFlowStore = create<FlowState>((set, get) => ({
  // Initial state
  nodes: initialNodes,
  edges: [],
  variables: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  execution: null,
  isRunning: false,
  isPaused: false,
  copilotOpen: true,
  consoleOpen: true,

  // Node/Edge operations
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        { ...connection, type: 'smoothstep', animated: false },
        get().edges
      ),
    })
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] })
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    })
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    })
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId, selectedEdgeId: null })
  },

  selectEdge: (edgeId) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null })
  },

  // Variables
  addVariable: (variable) => {
    set({ variables: [...get().variables, variable] })
  },

  updateVariable: (id, updates) => {
    set({
      variables: get().variables.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })
  },

  deleteVariable: (id) => {
    set({ variables: get().variables.filter((v) => v.id !== id) })
  },

  // Execution
  startExecution: () => {
    const execution: ExecutionContext = {
      flowId: Date.now().toString(),
      variables: new Map(),
      logs: [],
      screenshots: [],
      startTime: new Date(),
      status: 'running',
    }
    set({ execution, isRunning: true, isPaused: false })

    // Reset all node statuses
    set({
      nodes: get().nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: 'idle', error: undefined },
      })),
    })
  },

  pauseExecution: () => {
    set({ isPaused: true })
    if (get().execution) {
      set({
        execution: { ...get().execution!, status: 'paused' },
      })
    }
  },

  resumeExecution: () => {
    set({ isPaused: false })
    if (get().execution) {
      set({
        execution: { ...get().execution!, status: 'running' },
      })
    }
  },

  stopExecution: () => {
    set({ isRunning: false, isPaused: false })
    if (get().execution) {
      set({
        execution: { ...get().execution!, status: 'completed' },
      })
    }
  },

  setCurrentNode: (nodeId) => {
    if (get().execution) {
      set({
        execution: { ...get().execution!, currentNodeId: nodeId },
      })
    }
  },

  setNodeStatus: (nodeId, status, error) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, status, error } }
          : node
      ),
    })
  },

  addLog: (log) => {
    const entry: LogEntry = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    if (get().execution) {
      set({
        execution: {
          ...get().execution!,
          logs: [...get().execution!.logs, entry],
        },
      })
    }
  },

  // UI
  toggleCopilot: () => set({ copilotOpen: !get().copilotOpen }),
  toggleConsole: () => set({ consoleOpen: !get().consoleOpen }),

  // Flow management
  clearFlow: () => {
    set({
      nodes: initialNodes,
      edges: [],
      variables: [],
      selectedNodeId: null,
      selectedEdgeId: null,
    })
  },

  loadFlow: (nodes, edges, variables = []) => {
    set({ nodes, edges, variables })
  },
}))
