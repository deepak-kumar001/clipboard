'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent default form refresh
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 flex items-center justify-center p-4 text-zinc-100">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">🔐 Login</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 mb-3 bg-zinc-700 border border-zinc-600 rounded text-zinc-100"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 mb-4 bg-zinc-700 border border-zinc-600 rounded text-zinc-100"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
