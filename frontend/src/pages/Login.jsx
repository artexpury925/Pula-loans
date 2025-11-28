import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ phone: '+267', pin: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form, { withCredentials: true });
      alert('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white text-black rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-botswana-blue mb-6">Login with PIN</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Phone (+267...)"
          value={form.phone}
          required
          className="w-full p-3 border rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="4-Digit PIN"
          type="password"
          maxLength="4"
          required
          className="w-full p-3 border rounded"
          onChange={(e) => setForm({ ...form, pin: e.target.value })}
        />
        <button type="submit" className="w-full bg-botswana-blue text-white py-4 rounded-lg font-bold text-xl">
          Login
        </button>
      </form>
    </div>
  );
}