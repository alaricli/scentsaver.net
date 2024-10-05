'use client';

import { useState } from 'react';
import { customerLogin } from '../utils/shopify';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<any | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const customerAccessToken = await customerLogin(
        form.email,
        form.password
      );

      localStorage.setItem(
        'customerAccessToken',
        customerAccessToken.accessToken
      );
      setSuccess('Login successful');

      // You can redirect the user after successful login
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-10">
      <div className="w-96">
        <h1 className="my-4 text-2xl font-bold">Sign In</h1>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div className="mb-1">
          <p>Sign into your account below</p>
          <p>
            Don't have an account? Create one{' '}
            <Link href="/signup">
              <span className="cursor-pointer underline hover:text-gray-600">
                here
              </span>
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border border-gray-500 p-2 shadow-sm"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              name="password"
              className="mt-1 block w-full rounded-md border border-gray-500 p-2 shadow-sm"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-gray-800 p-2 text-white"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
