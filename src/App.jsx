import { useState, useEffect } from 'react' // Importar useEffect
import { data } from './api/data.js'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { MobileSection } from './components/hero/MobileSection.jsx'
import { CarruselInf } from './components/slide/CarruselInf.jsx'
import { Navbar } from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'

function App() {
  const [fdata, setdata] = useState([])
  const [appContentVisible, setAppContentVisible] = useState(false); // Nuevo estado para controlar la visibilidad del contenido

  const fetchData = async () => {
    const res = await data()
    setdata(res)
    console.log(res)
  }

  useEffect(() => {
    // Al montar el componente App, esperamos un momento para que los fondos y demás
    // elementos "pesados" (como Aurora) tengan tiempo de empezar a cargar,
    // y luego hacemos que todo el contenido aparezca suavemente.
    const loadingTimer = setTimeout(() => {
      setAppContentVisible(true);
    }, 800); // Ajusta este tiempo (en ms) según lo que dure la "carga" visual de Aurora.
             // 800ms es un buen punto de partida.

    return () => clearTimeout(loadingTimer); // Limpieza del temporizador
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <div className="App">
      {/* El Navbar debe estar fuera de la animación de entrada si quieres que aparezca inmediatamente */}
      {/* Si quieres que se anime con el resto, muévelo dentro del div de animación */}
      {/* <Navbar /> */}

      {/* Este div controlará la animación de entrada de todo el contenido principal y el footer */}
      <div className={`transition-opacity duration-1000 ease-in-out ${appContentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <main> {/* Mantener el padding-top si el Navbar va a ser fijo y visible */}
          <MobileSection />
          <CarruselInf />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  )
}

export default App