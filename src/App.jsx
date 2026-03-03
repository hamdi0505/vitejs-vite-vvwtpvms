import { useEffect } from "react"
import { testConnection } from "./services/supabaseService"

function App() {

  useEffect(() => {
    const runTest = async () => {
      try {
        const data = await testConnection()
        console.log("Supabase Verbindung OK:", data)
      } catch (err) {
        console.error("Supabase Fehler:", err)
      }
    }

    runTest()
  }, [])

  return (
    <>
      <h1>Test läuft...</h1>
    </>
  )
}

export default App