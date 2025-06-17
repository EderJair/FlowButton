import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { data } from '../api/data.js'
import { MobileSection, CarruselInf } from '../features'
import { Footer } from '../components'

export function HomePage() {
  const navigate = useNavigate()
  const [fdata, setdata] = useState([])
  const [appContentVisible, setAppContentVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const fetchData = async () => {
    const res = await data()
    setdata(res)
    console.log(res)
  }

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setAppContentVisible(true)
    }, 800)

    return () => clearTimeout(loadingTimer)
  }, [])

  const handleNavigateToDashboard = () => {
    setIsExiting(true)
    // Fade suave de salida antes de navegar
    setTimeout(() => {
      navigate('/dashboard')
    }, 600)
  }

  return (
    <div className={`transition-opacity duration-600 ease-out ${
      appContentVisible && !isExiting ? 'opacity-100' : 'opacity-0'
    }`}>
      <main>
        <MobileSection onNavigateToDashboard={handleNavigateToDashboard} />
        <CarruselInf />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}