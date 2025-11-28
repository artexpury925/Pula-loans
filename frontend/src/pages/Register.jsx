import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '+267', omang: '', pin: '', referredBy: ''
  })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/register', form)
      alert(`Success! Your referral link:\n${res.data.referralLink}\nShare with friends (optional)!`)
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.error || 'Error')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white text-black rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-botswana-blue mb-6">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="First Name" required className="input" onChange={e => setForm({...form, firstName: e.target.value})} />
        <input placeholder="Last Name" required className="input" onChange={e => setForm({...form, lastName: e.target.value})} />
        <input placeholder="Phone (+267...)" value={form.phone} required className="input" onChange={e => setForm({...form, phone: e.target.value})} />
        <input placeholder="Omang (9 digits)" required className="input" onChange={e => setForm({...form, omang: e.target.value})} />
        <input placeholder="4-Digit PIN" type="password" maxLength="4" required className="input" onChange={e => setForm({...form, pin: e.target.value})} />
        <button type="submit" className="w-full bg-botswana-blue text-white py-4 rounded-lg font-bold text-xl">Register</button>
      </form>
    </div>
  )
}