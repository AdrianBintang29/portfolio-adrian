'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './login-action';

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label htmlFor="username" className="block text-sm font-bold text-navy">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="mt-2 w-full border border-navy/30 bg-white px-4 py-3 text-navy focus:border-navy focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-navy">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border border-navy/30 bg-white px-4 py-3 text-navy focus:border-navy focus:outline-none"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-bold text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-yellow px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper disabled:opacity-60"
      >
        {pending ? 'Memeriksa...' : 'Masuk'}
      </button>
    </form>
  );
}