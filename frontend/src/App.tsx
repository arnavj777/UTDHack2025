import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/api'

interface ApiResponse {
  data?: {
    message: string
    status: string
  }
  message?: string
}

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHello = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/hello/`)
      if (!response.ok) {
        throw new Error('Failed to fetch from API')
      }
      const data: ApiResponse = await response.json()
      // Handle new API response format: {data: {message, status}}
      setMessage(data.data?.message || data.message || 'No message received')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
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
            <li>Frontend: React with Vite running on <code>http://localhost:3000</code></li>
            <li>CORS is configured to allow communication between frontend and backend</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
