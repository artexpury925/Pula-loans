import { Routes, Route, Link } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

function App() {
  return (
    <div className="min-h-screen bg-botswana-blue text-white">
      <header className="bg-black py-6 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Pula Loans</h1>
          <p className="text-botswana-light">Fast. Fair. Botswana.</p>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/r/:code" element={<Home refCode />} />
      </Routes>
    </div>
  )
}

function Home({ refCode }) {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h2 className="text-3xl mb-8">Get a loan in minutes</h2>
      <div className="space-y-4">
        <Link to="/register" className="block bg-white text-botswana-blue py-4 rounded-lg text-xl font-bold">Apply Now</Link>
        <Link to="/login" className="block bg-botswana-dark py-4 rounded-lg">Login with PIN</Link>
      </div>
    </div>
  )
}

export default App