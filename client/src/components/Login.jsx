import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async e => {
    e.preventDefault();
    try {
      await login(form);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handle}>
      <input name="email" placeholder="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
      <button type="submit">Login</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
