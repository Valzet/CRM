import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '../router'
import { AppProviders } from './AppProviders'

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  )
}

export default App
