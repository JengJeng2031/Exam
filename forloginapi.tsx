// pages/login.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError(''); // Clear any previous errors

    // Validate inputs
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      // Send login request to the API
      const response = await axios.post('https://your-api-url.com/login', {
        username,
        password,
      });

      // Assume the API returns an auth token on successful login
      const { token } = response.data;
      if (token) {
        // Store the token in localStorage (or a cookie)
        localStorage.setItem('authToken', token);
        router.push('/'); // Redirect to home page (or any other page)
      } else {
        setError('Invalid credentials.');
      }
    } catch (error) {
      setError('Login failed. Please try again later.');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
