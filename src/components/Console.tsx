import { useState } from 'react'
import { useFlowStore } from '@/stores/flowStore'
import {
  Terminal,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
  AlertTriangle,
  Bug,
} from 'lucide-react'

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'all'

const levelIcons: Record<string, React.ReactNode> = {
  debug: <Bug className="w-3 h-3 text-gray-500" />,
  info: <Info className="w-3 h-3 text-blue-500" />,
  warn: <AlertTriangle className="w-3 h-3 text-yellow-500" />,
  error: <AlertCircle className="w-3 h-3 text-red-500" />,
}

const levelColors: Record<string, string> = {
  debug: 'text-gray-500',
  info: 'text-blue-500',
  warn: 'text-yellow-500',
  error: 'text-red-500',
}

export function Console() {
  const { execution, toggleConsole } = useFlowStore()
  const [filter, setFilter] = useState<LogLevel>('all')
  const [isExpanded, setIsExpanded] = useState(true)

  const logs = execution?.logs ?? []
  const filteredLogs = filter === 'all' ? logs : logs.filter((log) => log.level === filter)

  const clearLogs = () => {
    // In a real app, this would clear the logs from the store
  }

  const exportLogs = () => {
    const content = logs
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] ${log.nodeName ? `[${log.nodeName}] ` : ''}${log.message}`
      )
      .join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rpa-logs-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">控制台</span>
          <span className="text-xs text-muted-foreground">({filteredLogs.length})</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Filter */}
          <select
            className="text-xs bg-muted px-2 py-1 rounded border-none focus:outline-none focus:ring-1 focus:ring-primary"
            value={filter}
            onChange={(e) => setFilter(e.target.value as LogLevel)}
          >
            <option value="all">全部</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>

          <button
            onClick={clearLogs}
            className="p-1.5 hover:bg-muted rounded"
            title="清空"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={exportLogs}
            className="p-1.5 hover:bg-muted rounded"
            title="导出"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={toggleConsole}
            className="p-1.5 hover:bg-muted rounded ml-1"
            title="关闭"
          >
            <span className="text-xs">×</span>
          </button>
        </div>
      </div>

      {/* Log Content */}
      {isExpanded && (
        <div className="flex-1 overflow-auto font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {execution ? '暂无日志' : '运行流程以查看日志'}
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2 px-2 py-1 hover:bg-muted/50 rounded"
                >
                  <span className="text-muted-foreground shrink-0">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="shrink-0">{levelIcons[log.level]}</span>
                  {log.nodeName && (
                    <span className="text-primary shrink-0">[{log.nodeName}]</span>
                  )}
                  <span className={levelColors[log.level]}>{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Execution Status Bar */}
      {execution && (
        <div className="px-3 py-1.5 border-t border-border bg-muted/30 text-xs flex items-center gap-4">
          <span>
            状态:{' '}
            <span
              className={
                execution.status === 'running'
                  ? 'text-blue-500'
                  : execution.status === 'completed'
                    ? 'text-green-500'
                    : execution.status === 'error'
                      ? 'text-red-500'
                      : 'text-muted-foreground'
              }
            >
              {execution.status === 'running' && '运行中'}
              {execution.status === 'paused' && '已暂停'}
              {execution.status === 'completed' && '已完成'}
              {execution.status === 'error' && '错误'}
              {execution.status === 'idle' && '空闲'}
            </span>
          </span>
          {execution.currentNodeId && (
            <span>
              当前节点: <span className="text-primary">{execution.currentNodeId}</span>
            </span>
          )}
          <span>
            开始时间: {execution.startTime.toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  )
}
