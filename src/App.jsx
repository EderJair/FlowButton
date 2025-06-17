import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/navbar/Navbar.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App