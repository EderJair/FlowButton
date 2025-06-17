import { useState, useEffect } from 'react'
import { data } from '../api/data.js'
import { MobileSection } from '../components/hero/MobileSection.jsx'
import { CarruselInf } from '../components/slide/CarruselInf.jsx'
import Footer from '../components/footer/Footer.jsx'

export function HomePage() {
  const [fdata, setdata] = useState([])
  const [appContentVisible, setAppContentVisible] = useState(false)

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

  return (
    <div className={`transition-opacity duration-1000 ease-in-out ${appContentVisible ? 'opacity-100' : 'opacity-0'}`}>
      <main>
        <MobileSection />
        <CarruselInf />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}