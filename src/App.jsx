import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
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
          <Route path="analytics" element={<Analytics />} />        </Route>
      </Routes>
      
      {/* Sonner Toaster para notificaciones globales */}
      <Toaster 
        position="top-right"
        richColors
        expand={true}
        duration={4000}
        closeButton
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff'
          }
        }}
      />
    </div>
  )
}

export default App