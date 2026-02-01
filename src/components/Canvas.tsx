import { useCallback, useRef, DragEvent } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  ReactFlowInstance,
} from 'reactflow'
import { useFlowStore } from '@/stores/flowStore'
import { nodeTypes } from './nodes'
import { componentDefinitions } from '@/data/components'

export function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null)

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    selectEdge,
    selectedNodeId,
  } = useFlowStore()

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance
  }, [])

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/rpa-component')
      if (!type || !reactFlowInstance.current || !reactFlowWrapper.current) {
        return
      }

      const definition = componentDefinitions.find((c) => c.type === type)
      if (!definition) return

      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'actionNode',
        position,
        data: {
          type,
          name: definition.nameZh,
          props: { ...definition.defaultProps },
          status: 'idle',
        },
      }

      addNode(newNode)
    },
    [addNode]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: { id: string }) => {
      selectEdge(edge.id)
    },
    [selectEdge]
  )

  const onPaneClick = useCallback(() => {
    selectNode(null)
    selectEdge(null)
  }, [selectNode, selectEdge])

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          selected: node.id === selectedNodeId,
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
        }}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background gap={15} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.data?.status === 'running') return '#3b82f6'
            if (n.data?.status === 'success') return '#22c55e'
            if (n.data?.status === 'error') return '#ef4444'
            return '#94a3b8'
          }}
          nodeColor={(n) => {
            if (n.data?.status === 'running') return '#dbeafe'
            if (n.data?.status === 'success') return '#dcfce7'
            if (n.data?.status === 'error') return '#fee2e2'
            return '#f1f5f9'
          }}
        />
      </ReactFlow>
    </div>
  )
}
