import { useFlowStore } from '@/stores/flowStore'
import { componentDefinitions } from '@/data/components'
import { Settings, Trash2 } from 'lucide-react'

export function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNodeData, deleteNode } = useFlowStore()

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)
  const componentDef = selectedNode
    ? componentDefinitions.find((c) => c.type === selectedNode.data.type)
    : null

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-border">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            属性面板
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          选择一个节点以查看属性
        </div>
      </div>
    )
  }

  const handlePropChange = (key: string, value: unknown) => {
    updateNodeData(selectedNode.id, {
      props: {
        ...selectedNode.data.props,
        [key]: value,
      },
    })
  }

  const handleNameChange = (name: string) => {
    updateNodeData(selectedNode.id, { name })
  }

  const handleDelete = () => {
    if (selectedNode.data.type !== 'start' && selectedNode.data.type !== 'end') {
      deleteNode(selectedNode.id)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" />
          属性面板
        </h2>
        {selectedNode.data.type !== 'start' && selectedNode.data.type !== 'end' && (
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
            title="删除节点"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {/* Basic Info */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">节点名称</label>
          <input
            type="text"
            className="w-full px-3 py-2 text-sm bg-muted rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedNode.data.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">节点类型</label>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded">
            {componentDef?.nameZh || selectedNode.data.type}
          </div>
        </div>

        {/* Component-specific props */}
        {componentDef && componentDef.propsSchema.properties && (
          <div className="space-y-4 pt-2 border-t border-border">
            <h3 className="text-xs font-medium text-muted-foreground">组件属性</h3>

            {Object.entries(componentDef.propsSchema.properties).map(([key, schema]) => (
              <PropertyField
                key={key}
                name={key}
                schema={schema}
                value={selectedNode.data.props[key]}
                onChange={(value) => handlePropChange(key, value)}
                required={componentDef.propsSchema.required?.includes(key)}
              />
            ))}
          </div>
        )}

        {/* Node ID (readonly) */}
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="text-xs font-medium text-muted-foreground">节点ID</label>
          <div className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded font-mono">
            {selectedNode.id}
          </div>
        </div>
      </div>
    </div>
  )
}

interface PropertyFieldProps {
  name: string
  schema: {
    type: string
    title?: string
    titleZh?: string
    description?: string
    default?: unknown
    enum?: string[]
    enumLabels?: string[]
    placeholder?: string
  }
  value: unknown
  onChange: (value: unknown) => void
  required?: boolean
}

function PropertyField({ name, schema, value, onChange, required }: PropertyFieldProps) {
  const label = schema.titleZh || schema.title || name

  if (schema.type === 'select' && schema.enum) {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <select
          className="w-full px-3 py-2 text-sm bg-muted rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          value={String(value ?? schema.default ?? '')}
          onChange={(e) => onChange(e.target.value)}
        >
          {schema.enum.map((opt, idx) => (
            <option key={opt} value={opt}>
              {schema.enumLabels?.[idx] || opt}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (schema.type === 'boolean') {
    return (
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">{label}</label>
        <button
          className={`
            w-10 h-5 rounded-full transition-colors relative
            ${value ? 'bg-primary' : 'bg-muted-foreground/30'}
          `}
          onClick={() => onChange(!value)}
        >
          <div
            className={`
              absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
              ${value ? 'translate-x-5' : 'translate-x-0.5'}
            `}
          />
        </button>
      </div>
    )
  }

  if (schema.type === 'number') {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 text-sm bg-muted rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          value={String(value ?? schema.default ?? '')}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={schema.placeholder}
        />
      </div>
    )
  }

  // Default: string input
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {name === 'script' ? (
        <textarea
          className="w-full px-3 py-2 text-sm bg-muted rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary font-mono min-h-[100px]"
          value={String(value ?? schema.default ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={schema.placeholder}
        />
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 text-sm bg-muted rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          value={String(value ?? schema.default ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={schema.placeholder}
        />
      )}
    </div>
  )
}
