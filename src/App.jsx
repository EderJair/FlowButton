import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components'
import { HomePage } from './pages'
import { 
  DashboardLayout, 
  Workflows,
  Analytics
} from './features'
import './assets/styles/App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <HomePage />
          </>
        } />
          {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/workflows" replace />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App