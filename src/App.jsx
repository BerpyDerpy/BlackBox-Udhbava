import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null)

  // Persist session (simple check)
  useEffect(() => {
    const saved = localStorage.getItem('blackbox_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('blackbox_user', JSON.stringify(userData))
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  )
}

export default App
