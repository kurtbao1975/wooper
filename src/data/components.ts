import type { ComponentDefinition } from '@/types/flow'

export const componentDefinitions: ComponentDefinition[] = [
  // Browser Operations
  {
    type: 'openBrowser',
    category: 'browser',
    name: 'Open Browser',
    nameZh: '打开浏览器',
    icon: 'globe',
    description: 'Launch a new browser instance',
    descriptionZh: '启动一个新的浏览器实例',
    defaultProps: {
      browser: 'chromium',
      headless: false,
    },
    propsSchema: {
      type: 'object',
      properties: {
        browser: {
          type: 'select',
          title: 'Browser',
          titleZh: '浏览器',
          enum: ['chromium', 'firefox', 'webkit'],
          enumLabels: ['Chromium', 'Firefox', 'WebKit'],
          default: 'chromium',
        },
        headless: {
          type: 'boolean',
          title: 'Headless Mode',
          titleZh: '无头模式',
          default: false,
        },
      },
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'navigate',
    category: 'browser',
    name: 'Navigate To',
    nameZh: '导航到',
    icon: 'globe',
    description: 'Navigate to a URL',
    descriptionZh: '导航到指定URL',
    defaultProps: {
      url: 'https://',
      waitUntil: 'load',
    },
    propsSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          title: 'URL',
          titleZh: 'URL地址',
          placeholder: 'https://example.com',
        },
        waitUntil: {
          type: 'select',
          title: 'Wait Until',
          titleZh: '等待条件',
          enum: ['load', 'domcontentloaded', 'networkidle'],
          enumLabels: ['Load', 'DOM Content Loaded', 'Network Idle'],
          default: 'load',
        },
      },
      required: ['url'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'closeBrowser',
    category: 'browser',
    name: 'Close Browser',
    nameZh: '关闭浏览器',
    icon: 'x',
    description: 'Close the browser instance',
    descriptionZh: '关闭浏览器实例',
    defaultProps: {},
    propsSchema: {
      type: 'object',
      properties: {},
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'screenshot',
    category: 'browser',
    name: 'Screenshot',
    nameZh: '截图',
    icon: 'camera',
    description: 'Take a screenshot of the page',
    descriptionZh: '对页面进行截图',
    defaultProps: {
      fullPage: false,
      path: '',
    },
    propsSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          title: 'Save Path',
          titleZh: '保存路径',
          placeholder: './screenshot.png',
        },
        fullPage: {
          type: 'boolean',
          title: 'Full Page',
          titleZh: '全页面截图',
          default: false,
        },
      },
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },

  // Page Interaction
  {
    type: 'click',
    category: 'interaction',
    name: 'Click',
    nameZh: '点击',
    icon: 'mouse-pointer',
    description: 'Click on an element',
    descriptionZh: '点击页面元素',
    defaultProps: {
      selector: '',
      button: 'left',
      clickCount: 1,
    },
    propsSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          title: 'Selector',
          titleZh: '选择器',
          placeholder: '#submit-btn 或 text=提交',
        },
        button: {
          type: 'select',
          title: 'Button',
          titleZh: '按钮',
          enum: ['left', 'right', 'middle'],
          enumLabels: ['左键', '右键', '中键'],
          default: 'left',
        },
        clickCount: {
          type: 'number',
          title: 'Click Count',
          titleZh: '点击次数',
          default: 1,
        },
      },
      required: ['selector'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'input',
    category: 'interaction',
    name: 'Input Text',
    nameZh: '输入文本',
    icon: 'type',
    description: 'Type text into an input field',
    descriptionZh: '在输入框中输入文本',
    defaultProps: {
      selector: '',
      text: '',
      clear: true,
    },
    propsSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          title: 'Selector',
          titleZh: '选择器',
          placeholder: '#username',
        },
        text: {
          type: 'string',
          title: 'Text',
          titleZh: '输入文本',
          placeholder: '要输入的文本',
        },
        clear: {
          type: 'boolean',
          title: 'Clear First',
          titleZh: '先清空',
          default: true,
        },
      },
      required: ['selector', 'text'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'hover',
    category: 'interaction',
    name: 'Hover',
    nameZh: '悬停',
    icon: 'hand',
    description: 'Hover over an element',
    descriptionZh: '在元素上悬停',
    defaultProps: {
      selector: '',
    },
    propsSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          title: 'Selector',
          titleZh: '选择器',
          placeholder: '.menu-item',
        },
      },
      required: ['selector'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'select',
    category: 'interaction',
    name: 'Select Option',
    nameZh: '下拉选择',
    icon: 'chevron-down',
    description: 'Select an option from a dropdown',
    descriptionZh: '从下拉菜单选择选项',
    defaultProps: {
      selector: '',
      value: '',
    },
    propsSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          title: 'Selector',
          titleZh: '选择器',
          placeholder: '#country-select',
        },
        value: {
          type: 'string',
          title: 'Value',
          titleZh: '值',
          placeholder: '选项值',
        },
      },
      required: ['selector', 'value'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'scroll',
    category: 'interaction',
    name: 'Scroll',
    nameZh: '滚动',
    icon: 'arrow-down',
    description: 'Scroll the page or element',
    descriptionZh: '滚动页面或元素',
    defaultProps: {
      direction: 'down',
      distance: 500,
    },
    propsSchema: {
      type: 'object',
      properties: {
        direction: {
          type: 'select',
          title: 'Direction',
          titleZh: '方向',
          enum: ['up', 'down', 'left', 'right'],
          enumLabels: ['上', '下', '左', '右'],
          default: 'down',
        },
        distance: {
          type: 'number',
          title: 'Distance (px)',
          titleZh: '距离(像素)',
          default: 500,
        },
      },
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },

  // Data Extraction
  {
    type: 'getText',
    category: 'data',
    name: 'Get Text',
    nameZh: '获取文本',
    icon: 'file-text',
    description: 'Get text content from an element',
    descriptionZh: '获取元素的文本内容',
    defaultProps: {
      selector: '',
      variable: 'text',
    },
    propsSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          title: 'Selector',
          titleZh: '选择器',
          placeholder: '.product-title',
        },
        variable: {
          type: 'string',
          title: 'Save To Variable',
          titleZh: '保存到变量',
          placeholder: 'text',
        },
      },
      required: ['selector'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'getAttribute',
    category: 'data',
    name: 'Get Attribute',
    nameZh: '获取属性',
    icon: 'tag',
    description: 'Get attribute value from an element',
    descriptionZh: '获取元素的属性值',
    defaultProps: {
      selector: '',
      attribute: 'href',
      variable: 'value',
    },
    propsSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          title: 'Selector',
          titleZh: '选择器',
          placeholder: 'a.link',
        },
        attribute: {
          type: 'string',
          title: 'Attribute',
          titleZh: '属性名',
          placeholder: 'href',
        },
        variable: {
          type: 'string',
          title: 'Save To Variable',
          titleZh: '保存到变量',
          placeholder: 'value',
        },
      },
      required: ['selector', 'attribute'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'getTable',
    category: 'data',
    name: 'Extract Table',
    nameZh: '提取表格',
    icon: 'table',
    description: 'Extract data from a table',
    descriptionZh: '从表格中提取数据',
    defaultProps: {
      selector: 'table',
      variable: 'tableData',
    },
    propsSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          title: 'Table Selector',
          titleZh: '表格选择器',
          placeholder: 'table.data-table',
        },
        variable: {
          type: 'string',
          title: 'Save To Variable',
          titleZh: '保存到变量',
          placeholder: 'tableData',
        },
      },
      required: ['selector'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },

  // Flow Control
  {
    type: 'wait',
    category: 'flow',
    name: 'Wait',
    nameZh: '等待',
    icon: 'clock',
    description: 'Wait for a specified time',
    descriptionZh: '等待指定时间',
    defaultProps: {
      duration: 1000,
    },
    propsSchema: {
      type: 'object',
      properties: {
        duration: {
          type: 'number',
          title: 'Duration (ms)',
          titleZh: '时长(毫秒)',
          default: 1000,
        },
      },
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'waitForElement',
    category: 'flow',
    name: 'Wait For Element',
    nameZh: '等待元素',
    icon: 'search',
    description: 'Wait for an element to appear',
    descriptionZh: '等待元素出现',
    defaultProps: {
      selector: '',
      state: 'visible',
      timeout: 30000,
    },
    propsSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          title: 'Selector',
          titleZh: '选择器',
          placeholder: '#loading',
        },
        state: {
          type: 'select',
          title: 'State',
          titleZh: '状态',
          enum: ['visible', 'hidden', 'attached', 'detached'],
          enumLabels: ['可见', '隐藏', '存在', '移除'],
          default: 'visible',
        },
        timeout: {
          type: 'number',
          title: 'Timeout (ms)',
          titleZh: '超时(毫秒)',
          default: 30000,
        },
      },
      required: ['selector'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'condition',
    category: 'flow',
    name: 'Condition',
    nameZh: '条件判断',
    icon: 'git-branch',
    description: 'Branch based on a condition',
    descriptionZh: '根据条件进行分支',
    defaultProps: {
      expression: '',
    },
    propsSchema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          title: 'Condition Expression',
          titleZh: '条件表达式',
          placeholder: '${count} > 10',
        },
      },
      required: ['expression'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [
      { id: 'true', name: 'True', type: 'flow' },
      { id: 'false', name: 'False', type: 'flow' },
    ],
  },
  {
    type: 'loop',
    category: 'flow',
    name: 'Loop',
    nameZh: '循环',
    icon: 'repeat',
    description: 'Repeat actions multiple times',
    descriptionZh: '重复执行操作',
    defaultProps: {
      type: 'count',
      count: 10,
    },
    propsSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'select',
          title: 'Loop Type',
          titleZh: '循环类型',
          enum: ['count', 'forEach', 'while'],
          enumLabels: ['固定次数', '遍历数组', '条件循环'],
          default: 'count',
        },
        count: {
          type: 'number',
          title: 'Count',
          titleZh: '次数',
          default: 10,
        },
      },
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [
      { id: 'body', name: 'Loop Body', type: 'flow' },
      { id: 'exit', name: 'Exit', type: 'flow' },
    ],
  },
  {
    type: 'tryCatch',
    category: 'flow',
    name: 'Try/Catch',
    nameZh: '异常处理',
    icon: 'shield',
    description: 'Handle errors gracefully',
    descriptionZh: '优雅处理错误',
    defaultProps: {},
    propsSchema: {
      type: 'object',
      properties: {},
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [
      { id: 'try', name: 'Try', type: 'flow' },
      { id: 'catch', name: 'Catch', type: 'flow' },
    ],
  },

  // Advanced
  {
    type: 'executeScript',
    category: 'advanced',
    name: 'Execute Script',
    nameZh: '执行脚本',
    icon: 'code',
    description: 'Execute custom JavaScript',
    descriptionZh: '执行自定义JavaScript',
    defaultProps: {
      script: '// Your code here\nreturn document.title;',
    },
    propsSchema: {
      type: 'object',
      properties: {
        script: {
          type: 'string',
          title: 'JavaScript Code',
          titleZh: 'JavaScript代码',
        },
      },
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'apiRequest',
    category: 'advanced',
    name: 'API Request',
    nameZh: 'API请求',
    icon: 'send',
    description: 'Make an HTTP request',
    descriptionZh: '发送HTTP请求',
    defaultProps: {
      method: 'GET',
      url: '',
      headers: {},
      body: '',
    },
    propsSchema: {
      type: 'object',
      properties: {
        method: {
          type: 'select',
          title: 'Method',
          titleZh: '方法',
          enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          default: 'GET',
        },
        url: {
          type: 'string',
          title: 'URL',
          titleZh: 'URL地址',
          placeholder: 'https://api.example.com/data',
        },
        headers: {
          type: 'object',
          title: 'Headers',
          titleZh: '请求头',
        },
        body: {
          type: 'string',
          title: 'Body',
          titleZh: '请求体',
        },
      },
      required: ['url'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
  {
    type: 'setVariable',
    category: 'advanced',
    name: 'Set Variable',
    nameZh: '设置变量',
    icon: 'variable',
    description: 'Set a variable value',
    descriptionZh: '设置变量值',
    defaultProps: {
      name: '',
      value: '',
    },
    propsSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Variable Name',
          titleZh: '变量名',
          placeholder: 'myVar',
        },
        value: {
          type: 'string',
          title: 'Value',
          titleZh: '值',
          placeholder: '变量值或表达式',
        },
      },
      required: ['name'],
    },
    inputs: [{ id: 'in', name: 'Input', type: 'flow' }],
    outputs: [{ id: 'out', name: 'Output', type: 'flow' }],
  },
]

// Group components by category
export const componentsByCategory = componentDefinitions.reduce(
  (acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = []
    }
    acc[component.category].push(component)
    return acc
  },
  {} as Record<string, ComponentDefinition[]>
)

export const categoryLabels: Record<string, { name: string; nameZh: string }> = {
  browser: { name: 'Browser', nameZh: '浏览器' },
  interaction: { name: 'Interaction', nameZh: '页面交互' },
  data: { name: 'Data', nameZh: '数据提取' },
  flow: { name: 'Flow Control', nameZh: '流程控制' },
  desktop: { name: 'Desktop', nameZh: '桌面操作' },
  advanced: { name: 'Advanced', nameZh: '高级功能' },
}
