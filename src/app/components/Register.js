'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    name: '',
    email: '',
  });
  const [message, setMessage] = useState(null);
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('You are registered! Please Login.');
      setFormData({ login: '', password: '', name: '', email: '' });
      setTimeout(() => router.push('/account'), 2000);
    } else {
      setMessage('Registration error, please try again.');
    }
  }

  return (
    <form onSubmit={handleRegister} className="flex flex-col space-y-4">
      {message && <p className="text-center text-green-600">{message}</p>}
      <input 
        type="text" 
        placeholder="Login" 
        value={formData.login} 
        onChange={(e) => setFormData({ ...formData, login: e.target.value })} 
        className="border px-4 py-2 rounded-md"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={formData.password} 
        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
        className="border px-4 py-2 rounded-md"
      />
      <input 
        type="text" 
        placeholder="Name" 
        value={formData.name} 
        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
        className="border px-4 py-2 rounded-md"
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={formData.email} 
        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
        className="border px-4 py-2 rounded-md"
      />
      <button type="submit" className="bg-black text-white py-2 rounded-md hover:bg-gray-800">
        Register
      </button>
    </form>
  );
}
