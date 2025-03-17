'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login({ setUser }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (res.ok) {
      const { user } = await res.json();
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/account');
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-4">
      <input 
        type="text" 
        placeholder="Login" 
        value={login} 
        onChange={(e) => setLogin(e.target.value)} 
        className="border px-4 py-2 rounded-md"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="border px-4 py-2 rounded-md"
      />
      <button type="submit" className="bg-black text-white py-2 rounded-md hover:bg-gray-800">
        Log In
      </button>
    </form>
  );
}