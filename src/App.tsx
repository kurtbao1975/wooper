import { ReactFlowProvider } from 'reactflow'
import { Layout } from '@/components/Layout'
import 'reactflow/dist/style.css'

function App() {
  return (
    <ReactFlowProvider>
      <Layout />
    </ReactFlowProvider>
  )
}

export default App
