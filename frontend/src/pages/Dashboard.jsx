import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [bundles, setBundles] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await axios.get('/api/loans/bundles', { withCredentials: true });
        setBundles(res.data);
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchBundles();
  }, [navigate]);

  const handleApply = async () => {
    if (!selected) return alert('Select a bundle');
    try {
      await axios.post('/api/loans/apply', selected, { withCredentials: true });
      alert('Loan applied!');
    } catch (err) {
      alert('Error applying');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white text-black rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-botswana-blue mb-6">Loan Dashboard</h2>
      <div className="space-y-4">
        {bundles.map((b) => (
          <button
            key={b.amount}
            onClick={() => setSelected({ amount: b.amount, repayAmount: b.repay })}
            className="w-full p-4 bg-botswana-light rounded-lg"
          >
            {b.label}: P{b.amount} (Repay P{b.repay})
          </button>
        ))}
        <button onClick={handleApply} className="w-full bg-botswana-blue text-white py-4 rounded-lg font-bold text-xl">
          Apply Now
        </button>
      </div>
    </div>
  );
}