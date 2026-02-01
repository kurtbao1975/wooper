import type { FlowNode, FlowEdge, ExecutionResult, LogEntry, FlowNodeData } from '@/types/flow'

export interface EngineOptions {
  headless?: boolean
  timeout?: number
  screenshotOnError?: boolean
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
}

export interface EngineCallbacks {
  onNodeStart?: (nodeId: string, nodeName: string) => void
  onNodeComplete?: (nodeId: string, nodeName: string, success: boolean, error?: string) => void
  onLog?: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void
  onStatusChange?: (status: string) => void
}

export class FlowEngine {
  private nodes: FlowNode[] = []
  private edges: FlowEdge[] = []
  private options: EngineOptions = {}
  private callbacks: EngineCallbacks = {}
  private variables: Map<string, unknown> = new Map()
  private isRunning = false
  private isPaused = false
  private shouldStop = false

  constructor(options?: EngineOptions) {
    this.options = {
      headless: false,
      timeout: 30000,
      screenshotOnError: true,
      logLevel: 'info',
      ...options,
    }
  }

  setCallbacks(callbacks: EngineCallbacks) {
    this.callbacks = callbacks
  }

  load(nodes: FlowNode[], edges: FlowEdge[]) {
    this.nodes = nodes
    this.edges = edges
  }

  setVariable(name: string, value: unknown) {
    this.variables.set(name, value)
  }

  getVariable(name: string): unknown {
    return this.variables.get(name)
  }

  async run(): Promise<ExecutionResult> {
    this.isRunning = true
    this.isPaused = false
    this.shouldStop = false

    const startTime = new Date()
    const logs: LogEntry[] = []

    this.log('info', '开始执行流程')
    this.callbacks.onStatusChange?.('running')

    try {
      // Find start node
      const startNode = this.nodes.find((n) => n.data.type === 'start')
      if (!startNode) {
        throw new Error('未找到开始节点')
      }

      // Execute from start node
      await this.executeNode(startNode.id)

      this.log('info', '流程执行完成')
      this.callbacks.onStatusChange?.('completed')

      return {
        success: true,
        startTime,
        endTime: new Date(),
        duration: Date.now() - startTime.getTime(),
        logs,
        screenshots: [],
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.log('error', `流程执行失败: ${errorMessage}`)
      this.callbacks.onStatusChange?.('error')

      return {
        success: false,
        startTime,
        endTime: new Date(),
        duration: Date.now() - startTime.getTime(),
        error: errorMessage,
        logs,
        screenshots: [],
      }
    } finally {
      this.isRunning = false
    }
  }

  pause() {
    this.isPaused = true
    this.callbacks.onStatusChange?.('paused')
  }

  resume() {
    this.isPaused = false
    this.callbacks.onStatusChange?.('running')
  }

  stop() {
    this.shouldStop = true
    this.isRunning = false
    this.callbacks.onStatusChange?.('stopped')
  }

  private async executeNode(nodeId: string): Promise<void> {
    if (this.shouldStop) {
      throw new Error('流程已停止')
    }

    // Wait if paused
    while (this.isPaused) {
      await this.sleep(100)
      if (this.shouldStop) {
        throw new Error('流程已停止')
      }
    }

    const node = this.nodes.find((n) => n.id === nodeId)
    if (!node) {
      throw new Error(`未找到节点: ${nodeId}`)
    }

    // Skip end node execution (just mark as reached)
    if (node.data.type === 'end') {
      this.callbacks.onNodeStart?.(nodeId, node.data.name)
      this.callbacks.onNodeComplete?.(nodeId, node.data.name, true)
      return
    }

    this.log('info', `执行节点: ${node.data.name}`, nodeId, node.data.name)
    this.callbacks.onNodeStart?.(nodeId, node.data.name)

    try {
      // Execute the node based on its type
      await this.executeNodeAction(node)

      this.callbacks.onNodeComplete?.(nodeId, node.data.name, true)

      // Find and execute next nodes
      const outgoingEdges = this.edges.filter((e) => e.source === nodeId)

      for (const edge of outgoingEdges) {
        // Handle conditional edges
        if (edge.sourceHandle === 'true' || edge.sourceHandle === 'false') {
          // For condition nodes, check the condition result
          const conditionResult = this.variables.get(`__condition_${nodeId}`)
          if (
            (edge.sourceHandle === 'true' && conditionResult) ||
            (edge.sourceHandle === 'false' && !conditionResult)
          ) {
            await this.executeNode(edge.target)
          }
        } else if (edge.sourceHandle === 'body') {
          // Loop body - handled in loop execution
          continue
        } else if (edge.sourceHandle === 'exit') {
          // Loop exit - handled after loop
          continue
        } else {
          // Normal flow
          await this.executeNode(edge.target)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.log('error', `节点执行失败: ${errorMessage}`, nodeId, node.data.name)
      this.callbacks.onNodeComplete?.(nodeId, node.data.name, false, errorMessage)
      throw error
    }
  }

  private async executeNodeAction(node: FlowNode): Promise<void> {
    const { type, props } = node.data

    switch (type) {
      case 'start':
        // Start node does nothing
        break

      case 'openBrowser':
        this.log('info', `打开浏览器: ${props.browser || 'chromium'}`, node.id, node.data.name)
        // In real implementation, this would call Playwright via IPC
        await this.sleep(500)
        break

      case 'navigate':
        this.log('info', `导航到: ${props.url}`, node.id, node.data.name)
        await this.sleep(300)
        break

      case 'click':
        this.log('info', `点击元素: ${props.selector}`, node.id, node.data.name)
        await this.sleep(200)
        break

      case 'input':
        this.log('info', `输入文本: ${props.text}`, node.id, node.data.name)
        await this.sleep(200)
        break

      case 'wait':
        this.log('info', `等待 ${props.duration}ms`, node.id, node.data.name)
        await this.sleep(props.duration as number || 1000)
        break

      case 'waitForElement':
        this.log('info', `等待元素: ${props.selector}`, node.id, node.data.name)
        await this.sleep(300)
        break

      case 'getText':
        this.log('info', `获取文本: ${props.selector}`, node.id, node.data.name)
        this.variables.set(String(props.variable || 'text'), 'Sample extracted text')
        await this.sleep(100)
        break

      case 'screenshot':
        this.log('info', `截图保存到: ${props.path || '内存'}`, node.id, node.data.name)
        await this.sleep(200)
        break

      case 'condition':
        // Evaluate condition (simplified)
        const expression = String(props.expression || 'true')
        const result = this.evaluateExpression(expression)
        this.variables.set(`__condition_${node.id}`, result)
        this.log('info', `条件判断: ${expression} = ${result}`, node.id, node.data.name)
        break

      case 'loop':
        await this.executeLoop(node)
        break

      case 'executeScript':
        this.log('info', '执行自定义脚本', node.id, node.data.name)
        await this.sleep(100)
        break

      default:
        this.log('warn', `未知节点类型: ${type}`, node.id, node.data.name)
    }
  }

  private async executeLoop(node: FlowNode): Promise<void> {
    const { props } = node.data
    const loopType = props.type as string || 'count'
    const count = props.count as number || 1

    // Find loop body edge
    const bodyEdge = this.edges.find(
      (e) => e.source === node.id && e.sourceHandle === 'body'
    )

    if (loopType === 'count') {
      for (let i = 0; i < count; i++) {
        if (this.shouldStop) break

        this.log('info', `循环迭代 ${i + 1}/${count}`, node.id, node.data.name)
        this.variables.set('__loopIndex', i)

        if (bodyEdge) {
          await this.executeNode(bodyEdge.target)
        }
      }
    }

    // Execute exit path
    const exitEdge = this.edges.find(
      (e) => e.source === node.id && e.sourceHandle === 'exit'
    )
    if (exitEdge) {
      await this.executeNode(exitEdge.target)
    }
  }

  private evaluateExpression(expression: string): boolean {
    // Simple expression evaluation
    // Replace variables
    let evaluated = expression
    for (const [key, value] of this.variables) {
      evaluated = evaluated.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), String(value))
    }

    try {
      // Very simple evaluation (in production, use a proper expression parser)
      if (evaluated === 'true') return true
      if (evaluated === 'false') return false
      // eslint-disable-next-line no-eval
      return Boolean(eval(evaluated))
    } catch {
      return false
    }
  }

  private log(
    level: LogEntry['level'],
    message: string,
    nodeId?: string,
    nodeName?: string
  ) {
    this.callbacks.onLog?.({ level, message, nodeId, nodeName })
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// Singleton instance
let engineInstance: FlowEngine | null = null

export function getFlowEngine(options?: EngineOptions): FlowEngine {
  if (!engineInstance) {
    engineInstance = new FlowEngine(options)
  }
  return engineInstance
}
