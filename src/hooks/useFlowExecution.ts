import { useCallback } from 'react'
import { useFlowStore } from '@/stores/flowStore'
import { FlowEngine } from '@/engine/FlowEngine'

let engine: FlowEngine | null = null

export function useFlowExecution() {
  const {
    nodes,
    edges,
    startExecution,
    stopExecution,
    pauseExecution,
    resumeExecution,
    setNodeStatus,
    setCurrentNode,
    addLog,
    isRunning,
    isPaused,
  } = useFlowStore()

  const run = useCallback(async () => {
    if (!engine) {
      engine = new FlowEngine()
    }

    // Set up callbacks
    engine.setCallbacks({
      onNodeStart: (nodeId, nodeName) => {
        setCurrentNode(nodeId)
        setNodeStatus(nodeId, 'running')
        addLog({
          level: 'info',
          message: `开始执行: ${nodeName}`,
          nodeId,
          nodeName,
        })
      },
      onNodeComplete: (nodeId, nodeName, success, error) => {
        setNodeStatus(nodeId, success ? 'success' : 'error', error)
        addLog({
          level: success ? 'info' : 'error',
          message: success ? `执行成功: ${nodeName}` : `执行失败: ${nodeName} - ${error}`,
          nodeId,
          nodeName,
        })
      },
      onLog: (log) => {
        addLog(log)
      },
      onStatusChange: (status) => {
        if (status === 'completed' || status === 'error' || status === 'stopped') {
          stopExecution()
        }
      },
    })

    // Load flow
    engine.load(nodes, edges)

    // Start execution
    startExecution()

    try {
      const result = await engine.run()
      console.log('Execution result:', result)
      return result
    } catch (error) {
      console.error('Execution error:', error)
      throw error
    }
  }, [nodes, edges, startExecution, stopExecution, setNodeStatus, setCurrentNode, addLog])

  const pause = useCallback(() => {
    if (engine) {
      engine.pause()
      pauseExecution()
    }
  }, [pauseExecution])

  const resume = useCallback(() => {
    if (engine) {
      engine.resume()
      resumeExecution()
    }
  }, [resumeExecution])

  const stop = useCallback(() => {
    if (engine) {
      engine.stop()
      stopExecution()
    }
  }, [stopExecution])

  return {
    run,
    pause,
    resume,
    stop,
    isRunning,
    isPaused,
  }
}
