import { DragEvent, useState } from 'react'
import {
  Globe,
  MousePointer,
  Type,
  Clock,
  GitBranch,
  Repeat,
  Table,
  Code,
  ChevronDown,
  ChevronRight,
  Search,
  Camera,
  FileText,
  Tag,
  Hand,
  ChevronDownIcon,
  ArrowDown,
  SearchIcon,
  Shield,
  Send,
  Variable,
  X,
} from 'lucide-react'
import { componentsByCategory, categoryLabels } from '@/data/components'
import type { ComponentDefinition } from '@/types/flow'

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe className="w-4 h-4" />,
  'mouse-pointer': <MousePointer className="w-4 h-4" />,
  type: <Type className="w-4 h-4" />,
  clock: <Clock className="w-4 h-4" />,
  'git-branch': <GitBranch className="w-4 h-4" />,
  repeat: <Repeat className="w-4 h-4" />,
  table: <Table className="w-4 h-4" />,
  code: <Code className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
  'file-text': <FileText className="w-4 h-4" />,
  tag: <Tag className="w-4 h-4" />,
  hand: <Hand className="w-4 h-4" />,
  'chevron-down': <ChevronDownIcon className="w-4 h-4" />,
  'arrow-down': <ArrowDown className="w-4 h-4" />,
  search: <SearchIcon className="w-4 h-4" />,
  shield: <Shield className="w-4 h-4" />,
  send: <Send className="w-4 h-4" />,
  variable: <Variable className="w-4 h-4" />,
  x: <X className="w-4 h-4" />,
}

export function ComponentPalette() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(categoryLabels))
  )

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const filteredComponents = searchTerm
    ? Object.entries(componentsByCategory).reduce(
        (acc, [category, components]) => {
          const filtered = components.filter(
            (c) =>
              c.nameZh.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          if (filtered.length > 0) {
            acc[category] = filtered
          }
          return acc
        },
        {} as Record<string, ComponentDefinition[]>
      )
    : componentsByCategory

  const onDragStart = (event: DragEvent<HTMLDivElement>, type: string) => {
    event.dataTransfer.setData('application/rpa-component', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-60 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <h2 className="font-semibold text-sm mb-2">组件库</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索组件..."
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted rounded border-none focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-auto">
        {Object.entries(filteredComponents).map(([category, components]) => (
          <div key={category} className="border-b border-border last:border-b-0">
            {/* Category Header */}
            <button
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/50 text-left"
              onClick={() => toggleCategory(category)}
            >
              {expandedCategories.has(category) ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {categoryLabels[category]?.nameZh || category}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {components.length}
              </span>
            </button>

            {/* Components */}
            {expandedCategories.has(category) && (
              <div className="pb-2">
                {components.map((component) => (
                  <ComponentItem
                    key={component.type}
                    component={component}
                    onDragStart={onDragStart}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface ComponentItemProps {
  component: ComponentDefinition
  onDragStart: (event: DragEvent<HTMLDivElement>, type: string) => void
}

function ComponentItem({ component, onDragStart }: ComponentItemProps) {
  const icon = iconMap[component.icon] || <Code className="w-4 h-4" />

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 mx-2 rounded cursor-grab hover:bg-muted/70 transition-colors"
      draggable
      onDragStart={(e) => onDragStart(e, component.type)}
    >
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">{component.nameZh}</div>
      </div>
    </div>
  )
}
