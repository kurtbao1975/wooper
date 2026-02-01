import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, Lightbulb, X, Loader2 } from 'lucide-react'
import { useFlowStore } from '@/stores/flowStore'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Suggestion {
  id: string
  title: string
  description: string
  action: () => void
}

export function CopilotPanel() {
  const { toggleCopilot, selectedNodeId, nodes } = useFlowStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是 Copilot，可以帮助你创建和优化自动化流程。你可以问我关于RPA的问题，或者描述你想要自动化的任务。',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  const suggestions: Suggestion[] = selectedNode
    ? [
        {
          id: '1',
          title: '添加等待条件',
          description: '在此操作前添加等待元素可见的步骤',
          action: () => {
            setInput('帮我在这个节点前添加等待条件')
          },
        },
        {
          id: '2',
          title: '添加错误处理',
          description: '为此操作添加异常处理',
          action: () => {
            setInput('帮我给这个节点添加错误处理')
          },
        },
      ]
    : [
        {
          id: '1',
          title: '创建数据采集流程',
          description: '帮我创建一个网页数据采集流程',
          action: () => {
            setInput('帮我创建一个从网页采集数据的流程')
          },
        },
        {
          id: '2',
          title: '自动登录流程',
          description: '创建一个自动登录网站的流程',
          action: () => {
            setInput('帮我创建一个自动登录的流程')
          },
        },
      ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response (in real app, this would call AI API)
    setTimeout(() => {
      const response = generateResponse(userMessage.content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Copilot</span>
          <Sparkles className="w-3 h-3 text-yellow-500" />
        </div>
        <button
          onClick={toggleCopilot}
          className="p-1 hover:bg-muted rounded"
          title="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length <= 2 && (
        <div className="p-2 border-b border-border space-y-1.5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lightbulb className="w-3 h-3" />
            <span>建议</span>
          </div>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full text-left p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
              onClick={suggestion.action}
            >
              <div className="text-xs font-medium">{suggestion.title}</div>
              <div className="text-xs text-muted-foreground">
                {suggestion.description}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-border">
        <div className="flex items-end gap-2">
          <textarea
            className="flex-1 px-3 py-2 text-sm bg-muted rounded border-none focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="输入问题或描述任务..."
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Simple response generator (would be replaced with actual AI in production)
function generateResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes('登录') || lowerInput.includes('login')) {
    return `好的，创建自动登录流程需要以下步骤：

1. **打开浏览器** - 启动浏览器实例
2. **导航到登录页** - 访问登录URL
3. **输入用户名** - 在用户名输入框填入
4. **输入密码** - 在密码输入框填入
5. **点击登录** - 点击登录按钮
6. **等待登录成功** - 等待页面跳转或成功元素出现

你可以从左侧组件库拖拽相应组件到画布中构建这个流程。需要我帮你自动生成这个流程吗？`
  }

  if (lowerInput.includes('采集') || lowerInput.includes('数据') || lowerInput.includes('爬')) {
    return `创建数据采集流程，建议包含以下步骤：

1. **打开浏览器** - 使用 Chromium
2. **导航到目标页面** - 访问数据源URL
3. **等待页面加载** - 等待数据元素出现
4. **提取数据** - 使用"提取表格"或"获取文本"组件
5. **循环分页**（可选）- 如需采集多页
6. **保存数据** - 导出到Excel或JSON

建议添加错误处理和适当的等待时间，避免被反爬虫机制拦截。`
  }

  if (lowerInput.includes('等待') || lowerInput.includes('wait')) {
    return `在操作前添加等待条件是好习惯！推荐使用：

- **等待元素** - 等待目标元素出现/可见
- **等待导航** - 等待页面跳转完成
- **固定等待** - 固定延时（不推荐过多使用）

从组件库的"流程控制"分类中拖拽"等待元素"组件即可。`
  }

  if (lowerInput.includes('错误') || lowerInput.includes('异常') || lowerInput.includes('error')) {
    return `添加错误处理可以让流程更稳定：

1. 使用 **Try/Catch** 组件包裹可能出错的操作
2. 在 Catch 分支中添加：
   - 截图记录错误现场
   - 记录错误日志
   - 发送通知（可选）
   - 重试或跳过

每个组件也有"错误时继续"选项，可以在属性面板中设置。`
  }

  return `我理解你的需求。你可以通过以下方式创建自动化流程：

1. **拖拽组件** - 从左侧组件库拖拽到画布
2. **连接节点** - 拖动连接线建立执行顺序
3. **配置属性** - 在右侧属性面板设置参数

有什么具体的问题我可以帮你解答吗？`
}
