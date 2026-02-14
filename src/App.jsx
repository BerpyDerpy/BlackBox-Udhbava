import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'

function App() {
  const [user, setUser] = useState(null)
  const [adminMode, setAdminMode] = useState(false)

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

  const handleLogout = () => {
    setUser(null)
    setAdminMode(false)
    localStorage.removeItem('blackbox_user')
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : adminMode && user.isAdmin ? (
        <AdminPanel onBack={() => setAdminMode(false)} />
      ) : (
        <Dashboard
          user={user}
          onToggleAdmin={user.isAdmin ? () => setAdminMode(true) : null}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App
