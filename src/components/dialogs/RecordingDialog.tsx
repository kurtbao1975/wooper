import { useState } from 'react'
import { Video, Square, Pause, Play, X, Check, Loader2 } from 'lucide-react'

interface RecordingDialogProps {
  open: boolean
  onClose: () => void
  onComplete: (steps: RecordedStep[]) => void
}

export interface RecordedStep {
  id: string
  type: 'navigate' | 'click' | 'input' | 'scroll' | 'select'
  timestamp: number
  data: {
    url?: string
    selector?: string
    text?: string
    value?: string
  }
  screenshot?: string
}

export function RecordingDialog({ open, onClose, onComplete }: RecordingDialogProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [steps, setSteps] = useState<RecordedStep[]>([])
  const [recordingTime, setRecordingTime] = useState(0)

  if (!open) return null

  const startRecording = () => {
    setIsRecording(true)
    setSteps([])
    setRecordingTime(0)

    // Simulate recording (in real app, this would start actual screen recording)
    const interval = setInterval(() => {
      if (!isPaused) {
        setRecordingTime((t) => t + 1)
      }
    }, 1000)

    // Simulate captured steps
    setTimeout(() => {
      setSteps((prev) => [
        ...prev,
        {
          id: '1',
          type: 'navigate',
          timestamp: Date.now(),
          data: { url: 'https://example.com' },
        },
      ])
    }, 1000)

    setTimeout(() => {
      setSteps((prev) => [
        ...prev,
        {
          id: '2',
          type: 'click',
          timestamp: Date.now(),
          data: { selector: '#login-btn' },
        },
      ])
    }, 2000)

    return () => clearInterval(interval)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const handleComplete = () => {
    onComplete(steps)
    onClose()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">录屏生成流程</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {!isRecording ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">开始录制操作</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                点击开始录制后，系统会捕获您在浏览器中的操作，并自动生成对应的自动化流程。
              </p>
              <button
                onClick={startRecording}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto"
              >
                <Video className="w-4 h-4" />
                开始录制
              </button>
            </div>
          ) : (
            <div>
              {/* Recording status */}
              <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-medium">
                    {isPaused ? '已暂停' : '录制中'}
                  </span>
                  <span className="text-muted-foreground">
                    {formatTime(recordingTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePause}
                    className="p-2 hover:bg-muted rounded"
                    title={isPaused ? '继续' : '暂停'}
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={stopRecording}
                    className="p-2 hover:bg-destructive/10 hover:text-destructive rounded"
                    title="停止录制"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recorded steps */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  已录制步骤 ({steps.length})
                </h4>
                {steps.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p>等待操作...</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 p-2 bg-muted/30 rounded"
                      >
                        <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <span className="text-sm">
                          {step.type === 'navigate' && `导航到 ${step.data.url}`}
                          {step.type === 'click' && `点击 ${step.data.selector}`}
                          {step.type === 'input' && `输入 "${step.data.text}"`}
                          {step.type === 'scroll' && '滚动页面'}
                          {step.type === 'select' && `选择 ${step.data.value}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isRecording && steps.length > 0 && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm hover:bg-muted rounded"
            >
              取消
            </button>
            <button
              onClick={handleComplete}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              生成流程
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
