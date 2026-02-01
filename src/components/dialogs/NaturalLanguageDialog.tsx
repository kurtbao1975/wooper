import { useState } from 'react'
import { Wand2, X, Loader2, Check, RefreshCw, Plus } from 'lucide-react'

interface NaturalLanguageDialogProps {
  open: boolean
  onClose: () => void
  onGenerate: (steps: GeneratedStep[]) => void
}

export interface GeneratedStep {
  id: string
  type: string
  name: string
  description: string
  props: Record<string, unknown>
}

const examplePrompts = [
  '打开淘宝，搜索手机，按销量排序，获取前10个商品信息',
  '登录GitHub，进入我的仓库列表，获取所有仓库名称',
  '打开京东，搜索笔记本电脑，筛选价格5000-8000，下载第一页商品图片',
]

export function NaturalLanguageDialog({
  open,
  onClose,
  onGenerate,
}: NaturalLanguageDialogProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSteps, setGeneratedSteps] = useState<GeneratedStep[]>([])
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setGeneratedSteps([])

    try {
      // Simulate AI generation (in real app, this would call AI API)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Parse the prompt and generate steps
      const steps = parsePromptToSteps(prompt)
      setGeneratedSteps(steps)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleConfirm = () => {
    onGenerate(generatedSteps)
    onClose()
  }

  const useExample = (example: string) => {
    setPrompt(example)
    setGeneratedSteps([])
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-[700px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">自然语言生成流程</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Input area */}
          <div>
            <label className="block text-sm font-medium mb-2">
              描述你想要自动化的任务
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="例如：打开淘宝，搜索iPhone，获取前10个商品的名称和价格..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Example prompts */}
          {!generatedSteps.length && (
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                示例提示
              </label>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 text-sm bg-muted/50 hover:bg-muted rounded transition-colors"
                    onClick={() => useExample(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generate button */}
          {!generatedSteps.length && (
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI 正在分析...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  生成流程
                </>
              )}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Generated steps */}
          {generatedSteps.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  生成的流程步骤 ({generatedSteps.length})
                </label>
                <button
                  onClick={handleRegenerate}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  重新生成
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-auto">
                {generatedSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {step.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {generatedSteps.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <button
              onClick={() => setGeneratedSteps([])}
              className="px-4 py-2 text-sm hover:bg-muted rounded flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加更多步骤
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm hover:bg-muted rounded"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                确认生成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Simple prompt parser (in production, this would use AI)
function parsePromptToSteps(prompt: string): GeneratedStep[] {
  const steps: GeneratedStep[] = []
  const lowerPrompt = prompt.toLowerCase()

  // Always start with browser
  steps.push({
    id: `step-${Date.now()}-0`,
    type: 'openBrowser',
    name: '打开浏览器',
    description: '启动 Chromium 浏览器',
    props: { browser: 'chromium', headless: false },
  })

  // Detect navigation
  const sitePatterns = [
    { pattern: /淘宝|taobao/i, url: 'https://www.taobao.com' },
    { pattern: /京东|jd/i, url: 'https://www.jd.com' },
    { pattern: /github/i, url: 'https://github.com' },
    { pattern: /百度|baidu/i, url: 'https://www.baidu.com' },
  ]

  for (const { pattern, url } of sitePatterns) {
    if (pattern.test(prompt)) {
      steps.push({
        id: `step-${Date.now()}-1`,
        type: 'navigate',
        name: `导航到 ${new URL(url).hostname}`,
        description: `打开 ${url}`,
        props: { url, waitUntil: 'networkidle' },
      })
      break
    }
  }

  // Detect search action
  const searchMatch = prompt.match(/搜索[""']?([^""',，]+)[""']?/i)
  if (searchMatch) {
    steps.push({
      id: `step-${Date.now()}-2`,
      type: 'input',
      name: '输入搜索关键词',
      description: `在搜索框输入: ${searchMatch[1]}`,
      props: { selector: '#q, input[name="q"], .search-input', text: searchMatch[1], clear: true },
    })
    steps.push({
      id: `step-${Date.now()}-3`,
      type: 'click',
      name: '点击搜索',
      description: '点击搜索按钮',
      props: { selector: 'button[type="submit"], .search-btn, .btn-search' },
    })
    steps.push({
      id: `step-${Date.now()}-4`,
      type: 'waitForElement',
      name: '等待搜索结果',
      description: '等待搜索结果加载',
      props: { selector: '.search-result, .product-list, .items', state: 'visible', timeout: 10000 },
    })
  }

  // Detect sorting
  if (lowerPrompt.includes('销量')) {
    steps.push({
      id: `step-${Date.now()}-5`,
      type: 'click',
      name: '按销量排序',
      description: '点击销量排序选项',
      props: { selector: '[data-sort="sale"], .sort-sale, text=销量' },
    })
  }

  // Detect data extraction
  if (lowerPrompt.includes('获取') || lowerPrompt.includes('提取')) {
    const countMatch = prompt.match(/前(\d+)个/i)
    const count = countMatch ? parseInt(countMatch[1]) : 10

    steps.push({
      id: `step-${Date.now()}-6`,
      type: 'loop',
      name: `循环提取数据`,
      description: `提取前 ${count} 条数据`,
      props: { type: 'count', count },
    })

    steps.push({
      id: `step-${Date.now()}-7`,
      type: 'getText',
      name: '获取商品信息',
      description: '提取商品名称、价格等信息',
      props: { selector: '.item-title, .product-name', variable: 'productInfo' },
    })
  }

  // Detect login
  if (lowerPrompt.includes('登录')) {
    steps.push({
      id: `step-${Date.now()}-8`,
      type: 'click',
      name: '点击登录入口',
      description: '点击登录按钮',
      props: { selector: 'text=登录, .login-btn, a[href*="login"]' },
    })
  }

  return steps
}
