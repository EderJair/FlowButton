import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileSection, CarruselInf } from '../features'
import { Footer } from '../components'
import { Aurora } from '../components'

export function HomePage() {
  const navigate = useNavigate()
  const [fdata, setdata] = useState([])
  const [appContentVisible, setAppContentVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const fetchData = async () => {
    const res = await data()
    setdata(res)
    console.log(res)
  }

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setAppContentVisible(true)
      setIsLoaded(true)
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
    <div className={`bg-transparent relative overflow-hidden min-h-screen transition-opacity duration-600 ease-out ${
      appContentVisible && !isExiting ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Aurora Background */}
      <div className={`transition-opacity duration-500 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <Aurora
          colorStops={["#3A29FF","#3A29FF", "#8c3390"]}
          blend={0.3}
          amplitude={0.8}
          speed={1.5}
        />
      </div>
      
      {/* Content with backdrop */}
      <div className={`relative z-10 min-h-screen transition-all duration-600 ease-out transform ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <main>
          <MobileSection onNavigateToDashboard={handleNavigateToDashboard} />
          <CarruselInf />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  )
}