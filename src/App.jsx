import { useEffect } from 'react'
import { supabase } from './services/supabaseClient'

function App() {

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('workers')
        .select('*')

      if (error) {
        console.error('Supabase Fehler:', error)
      } else {
        console.log('Supabase Verbindung OK:', data)
      }
    }

    testConnection()
  }, [])

  return (
    <div>
      <h1>Dienstplan App</h1>
    </div>
  )
}

export default App