
export const data = async () => {
    try {
        const res = await fetch('http://localhost:4000/api/products')
        const data = await res.json()
        console.log(data)
        return data
        
    } catch (error) {
        console.error('Error en la data: ', error)
        return null
    }
}