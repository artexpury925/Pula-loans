import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/admin/users', { withCredentials: true });
        setUsers(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) navigate('/login');
      }
    };
    fetchUsers();
  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-botswana-blue mb-6">Admin Panel</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-botswana-blue text-white">
            <th className="p-2">Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Omang</th>
            <th className="p-2">Referral Code</th>
            <th className="p-2">Loans</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.phone} className="border-b">
              <td className="p-2">{u.firstName} {u.lastName}</td>
              <td className="p-2">{u.phone}</td>
              <td className="p-2">{u.omang}</td>
              <td className="p-2">{u.referralCode}</td>
              <td className="p-2">{u.loans.length} requests</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}