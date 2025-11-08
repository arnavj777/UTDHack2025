import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/api'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchHello = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/hello/`)
      if (!response.ok) {
        throw new Error('Failed to fetch from API')
      }
      const data = await response.json()
      setMessage(data.message)
    } catch (err) {
      setError(err.message)
      setMessage('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHello()
  }, [])

  return (
    <div className="app">
      <div className="container">
        <h1>Django + React App</h1>
        <p className="subtitle">Full-stack application setup</p>
        
        <div className="card">
          <button onClick={fetchHello} disabled={loading}>
            {loading ? 'Loading...' : 'Call Django API'}
          </button>
          
          {error && (
            <div className="error">
              <p>Error: {error}</p>
              <p className="hint">Make sure Django server is running on port 8000</p>
            </div>
          )}
          
          {message && (
            <div className="success">
              <p className="message">{message}</p>
            </div>
          )}
        </div>

        <div className="info">
          <h2>Getting Started</h2>
          <ul>
            <li>Backend: Django REST Framework running on <code>http://127.0.0.1:8000</code></li>
            <li>Frontend: React with Vite running on <code>http://localhost:5173</code></li>
            <li>CORS is configured to allow communication between frontend and backend</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
